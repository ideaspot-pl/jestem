import Image from "next/image";
import {useEffect, useState} from "react";

const ImageWithFallback = ({
       fallback = '/photos/user.svg',
       alt,
       src,
       ...props
}) => {
    const [error, setError] = useState(null)

    useEffect(() => {
        setError(null)
    }, [src]);

    return (
        <Image
            alt={alt}
            onError={setError}
            src={error ? fallback : src}
            {...props}
        />
    )
}

export default ImageWithFallback;
