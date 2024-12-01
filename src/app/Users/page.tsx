// src/app/users/page.tsx
"use client"; 
import { useUser , RedirectToSignIn } from '@clerk/nextjs';
import React, { useState } from 'react';

const UsersPage = () => {
    const { user, isLoaded } = useUser ();

  
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

   
    if (!isLoaded) {
        return <div>Loading...</div>;
    }

   
    if (!user) {
        return <RedirectToSignIn />;
    }

    const containerStyle: React.CSSProperties = {
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
    };

    const headerStyle: React.CSSProperties = {
        textAlign: 'center',
        color: '#333',
    };

    const userInfoStyle: React.CSSProperties = {
        listStyleType: 'none',
        padding: '0',
    };

    const listItemStyle: React.CSSProperties = {
        margin: '10px 0',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#fff',
        transition: 'background-color 0.3s',
    };

    const labelStyle: React.CSSProperties = {
        fontWeight: 'bold',
    };

   
    const lastSignInAt = user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : 'N/A';

    return (
        <div style={containerStyle}>
            <h1 style={headerStyle}>Welcome, {user.firstName}!</h1>
            <h2>User Information</h2>
            <ul style={userInfoStyle}>
                {[
                    { label: 'Email', value: user.primaryEmailAddress?.emailAddress || 'N/A' },
                    { label: 'First Name', value: user.firstName },
                    { label: 'Last Name', value: user.lastName },
                    { label: 'Phone', value: user.phoneNumbers?.[0]?.phoneNumber || 'N/A' },
                    { label: 'Created At', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A' },
                    { label: 'Last Sign In', value: lastSignInAt }, 
                ].map((item, index) => (
                    <li
                        key={index}
                        style={{
                            ...listItemStyle,
                            backgroundColor: hoveredIndex === index ? '#f1f1f1' : '#fff',
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <span style={labelStyle}>{item.label}:</span> {item.value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsersPage;