import React from "react";

export function MyFinished() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="mb-4 text-lg">Thank you for participating in this study.</p>
            <p className="mb-4 text-lg">Please copy this completion code into Prolific to claim your payment:</p>
            <p className="text-xl font-bold text-blue-500"><strong>C1JXRERM</strong></p>
        </div>
    );
}