import {ReactElement, useEffect, useState} from "react";
import useSWR from "swr";
import "./types";
import RoomSeatSelector from "./RoomSeatSelector";
import {useFormik} from "formik";
import {v4 as uuidv4} from 'uuid';
import {useTranslation} from "react-i18next";

const fetcher = (url: string) => fetch(url)
    .then(res => res.json())
    .catch(() => {
        throw new Error("Failed to fetch")
    });

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

export default function MarkAttendance({eventCode}: {
    eventCode?: string,
}): ReactElement {
    const {t} = useTranslation();
    const [selected, setSelected] = useState<SeatDTO|null>(null);
    const [values, setValues] = useState<FormValues>(initialValues);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const url = eventCode ? `/api/v1/event-info/${eventCode}` : '/api/v1/event-info';
    const {data, isLoading, error, mutate} = useSWR<EventInfoDTO>(url, fetcher, {
        refreshInterval: 5000,
    });

    const formik= useFormik({
        initialValues: values,
        enableReinitialize: true,
        validate,
        onSubmit: values => {
            if (!data) {
                return;
            }
            setIsSaving(true);
            const submitValues = {
                ...values,
                seat_row: selected ? selected[0] : null,
                seat_column: selected ? selected[1] : null,
            };
            const key = `event-form-${data.event.id}`;
            localStorage.setItem(key, JSON.stringify(submitValues));
            fetch(`/api/v1/event/${data.event.id}/attend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitValues),
            }).finally(() => {
                setIsSaving(false);
            });
            mutate();
            setValues(values);
            setSelected(selected);
        },
    });

    useEffect(() => {
        if (!data || !data.event) {
            return;
        }
        const key = `event-form-${data.event.id}`;
        const values = JSON.parse(localStorage.getItem(key)!) || initialValues;
        setValues(values);
        setSelected(values.seat_row && values.seat_column ? [values.seat_row, values.seat_column] : null);
    }, [data]);


    if (error) {
        return <div>Error: {error}</div>;
    }

    if (isLoading || !data || !data.event || !data.room) {
        return (
            <div className="text-center pt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <main className="container">
                <nav className="navbar sticky-top bg-body">
                    <div className="container-fluid">
                        <span className="navbar-brand mb-0 h1">{data.event.label}</span>
                        <span className="navbar-text">{data.room.label}: {data.event.start}</span>
                        <button className={`btn btn-outline-secondary`}
                                disabled={isSaving}
                                type="submit"
                                form="attendanceForm"
                        >
                            {t("mark_attendance.save")}
                            {isSaving ? (
                                <>
                                    <span className="ms-3 spinner-border spinner-border-sm" aria-hidden="true"></span>
                                    <span className="visually-hidden" role="status">Saving...</span>
                                </>
                            ) : null}
                        </button>
                    </div>
                </nav>

                <form onSubmit={formik.handleSubmit} className="mt-3" id="attendanceForm">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label htmlFor="firstname">{t("mark_attendance.firstname")}</label>
                                        <input
                                            onChange={formik.handleChange} value={formik.values.firstname} onBlur={formik.handleBlur}
                                            type="text"
                                            className={`form-control ${formik.touched.firstname && formik.errors.firstname ? 'is-invalid' : ''}`}
                                            id="firstname" name="firstname" placeholder={t("mark_attendance.firstname")} />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label htmlFor="lastname">{t("mark_attendance.lastname")}</label>
                                        <input
                                            onChange={formik.handleChange} value={formik.values.lastname} onBlur={formik.handleBlur}
                                            type="text"
                                            className={`form-control ${formik.touched.lastname && formik.errors.lastname ? 'is-invalid' : ''}`}
                                            id="lastname" name="lastname" placeholder={t("mark_attendance.lastname")} />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label htmlFor="code">{t("mark_attendance.code")}</label>
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
                                        <label className="form-check-label" htmlFor="is_remote">{t("mark_attendance.remote")}</label>
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
                                <label>{t("mark_attendance.seat")}</label>
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
