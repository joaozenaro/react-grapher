import { ChangeEvent, useEffect, useState } from 'react';
import availableThemes from '../../themes.json';

export default function ThemeSelector() {
    const [selectedTheme, setSelectedTheme] = useState(
        localStorage.getItem('selectedTheme') || availableThemes.themes[0]
    );

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', selectedTheme);
        localStorage.setItem('selectedTheme', selectedTheme);
    }, [selectedTheme]);

    const handleThemeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedTheme(event.target.value);
    };

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1">
                Theme
                <svg
                    width="12px"
                    height="12px"
                    className="inline-block h-2 w-2 fill-current opacity-60"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2048 2048"
                >
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content max-h-96 overflow-y-scroll bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl"
            >
                {availableThemes.themes.map((i, ix) => (
                    <li key={ix}>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                            aria-label={toTitleCase(i)}
                            value={i}
                            checked={selectedTheme === i}
                            onChange={handleThemeChange}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

function toTitleCase(str: string) {
    return str.toLowerCase().replace(/(^|\s)\w/g, function (letter) {
        return letter.toUpperCase();
    });
}
