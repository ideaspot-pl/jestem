import {ReactElement, useEffect, useState} from "react";
import useSWR from "swr";
import "./types";
import RoomSeatSelector from "./RoomSeatSelector";
import {useFormik} from "formik";
import {v4 as uuidv4} from 'uuid';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface FormValues {
    token: string,
    firstname: string;
    lastname: string;
    code: string;
    is_remote: boolean;
    selected?: SeatDTO;
}

const initialValues: FormValues = {
    token: uuidv4(),
    firstname: '',
    lastname: '',
    code: '',
    is_remote: false,
}

const validate = (values: FormValues) => {
    const errors: FormValues = {} as FormValues;
    if (!values.firstname) {
        errors.firstname = 'Required';
    }
    if (!values.lastname) {
        errors.lastname = 'Required';
    }
    if (!values.code) {
        errors.code = 'Required';
    } else if (!/^\d+$/.test(values.code)) {
        errors.code = 'Must be a number';
    }
    return errors;
}

export default function MarkAttendance(): ReactElement {
    const [selected, setSelected] = useState<SeatDTO|null>(null);
    const [values, setValues] = useState<FormValues>(initialValues);

    const {data, isLoading, error, mutate} = useSWR<EventInfoDTO>('/api/v1/event-info', fetcher, {
        refreshInterval: 5000,
    });

    const formik= useFormik({
        initialValues: values,
        enableReinitialize: true,
        validate,
        onSubmit: values => {
            alert('submit');
            if (!data) {
                return;
            }
            const submitValues = {...values, selected};
            const key = `event-form-${data.event.id}`;
            localStorage.setItem(key, JSON.stringify(submitValues));
            alert(JSON.stringify(submitValues, null, 2));
        },
    });

    useEffect(() => {
        if (!data || !data.event) {
            return;
        }
        const key = `event-form-${data.event.id}`;
        const values = JSON.parse(localStorage.getItem(key)!) || initialValues;
        setValues(values);
        setSelected(values.selected || null);
    }, [data]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (isLoading || !data) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <main className="container">
                <nav className="navbar sticky-top bg-body">
                    <div className="container-fluid">
                        <span className="navbar-brand mb-0 h1">{data.event.label}</span>
                        <span className="navbar-text">{data.room.label}: {data.event.start}</span>
                        <button className="btn btn-outline-secondary" type="submit" form="attendanceForm">Save</button>
                    </div>
                </nav>

                <form onSubmit={formik.handleSubmit} className="mt-3" id="attendanceForm">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label htmlFor="firstname">Firstname</label>
                                        <input
                                            onChange={formik.handleChange} value={formik.values.firstname} onBlur={formik.handleBlur}
                                            type="text"
                                            className={`form-control ${formik.touched.firstname && formik.errors.firstname ? 'is-invalid' : ''}`}
                                            id="firstname" name="firstname" placeholder="Firstname" />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label htmlFor="lastname">Lastname</label>
                                        <input
                                            onChange={formik.handleChange} value={formik.values.lastname} onBlur={formik.handleBlur}
                                            type="text"
                                            className={`form-control ${formik.touched.lastname && formik.errors.lastname ? 'is-invalid' : ''}`}
                                            id="lastname" name="lastname" placeholder="Lastname" />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label htmlFor="code">Code</label>
                                        <input
                                            onChange={formik.handleChange} value={formik.values.code} onBlur={formik.handleBlur}
                                            type="text"
                                            className={`form-control ${formik.touched.code && formik.errors.code ? 'is-invalid' : ''}`}
                                            id="code" name="code" placeholder="Code" />
                                        {formik.touched.code && formik.errors.code
                                            ? <div className="invalid-feedback">{formik.errors.code}</div>
                                            : null}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-check form-switch">
                                        <label className="form-check-label" htmlFor="is_remote">Remote?</label>
                                        <input
                                            onChange={formik.handleChange} onBlur={formik.handleBlur}
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="is_remote"
                                            name="is_remote"
                                            checked={formik.values.is_remote} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 text-center">
                            <div className="text-start mb-3">
                                <label>Seat</label>
                            </div>
                            <RoomSeatSelector
                                room={data.room}
                                selected={selected}
                                setSelected={setSelected}
                                readonly={formik.values.is_remote}
                            />
                        </div>
                    </div>
                </form>
            </main>
        </>
    );
}
