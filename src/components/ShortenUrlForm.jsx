/* eslint no-unused-vars: 1 */

import React, { useCallback, useState } from 'react';

const ShortenUrlForm = () => {
    const [value, setValue] = useState('');
    const [shortUrl, setShortUrl] = useState(null);
    const [apiError, setApiError] = useState(null);

    const copyToClipBoard = async copyText => {
        try {
            await navigator.clipboard.writeText(copyText);
        } catch (error) {
            throw Error('Unable to copy url to clipboard')
        }
    }

    const onChange = useCallback(
        (e) => {
            // TODO: Set the component's new state based on the user's input
            setValue(e.target.value)
        },
        [
            /* TODO: Add necessary deps */
            value
        ],
    );

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            // TODO: shorten url and copy to clipboard
            setValue('')
            setShortUrl(null)
            setApiError(null)

            fetch('http://localhost:5000/url', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    'source_url': value.toLocaleLowerCase()
                })
            })
            .then((response) => {
                if(!response.ok) {
                    throw Error(response.statusText)
                }
                return response.json()
            })
            .then((data) => {
                const shortUrlPath = data.short_url
                copyToClipBoard(shortUrlPath)
                setShortUrl(shortUrlPath)
            })
            .catch((error) => {
                setApiError(error.message)
            })
        },
        [
            /* TODO: necessary deps */
            value,
            shortUrl
        ],
    );

    return (
        <form onSubmit={onSubmit}>
            <label htmlFor="shorten">
                Url:
                <input
                    placeholder="Url to shorten"
                    id="shorten"
                    type="text"
                    value={value}
                    onChange={onChange}
                />
            </label>
            <input type="submit" value="Shorten and copy URL" />
            {/* TODO: show below only when the url has been shortened and copied */}
            {shortUrl && <div>{shortUrl} --- copied!</div>}
            {apiError && <div>Error: {apiError}</div>}
        </form>
    );
};

export default ShortenUrlForm;
