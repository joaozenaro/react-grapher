import { ChangeEvent, useEffect, useState } from 'react';
import availableThemes from '../../themes.json';
import { ChevronDown } from 'lucide-react';

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
            <div tabIndex={0} role="button" className="btn btn-sm m-1">
                Theme
                <ChevronDown size={20} />
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
