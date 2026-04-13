import React from 'react';
import Navbar from '../common/Navbar';

export const PageLayout = ({ children, title }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {title && (
                <header className="bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        <h1 className="text-2xl font-bold leading-tight text-gray-900">{title}</h1>
                    </div>
                </header>
            )}

            <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
                {children}
            </main>
        </div>
    );
};

export default PageLayout;
