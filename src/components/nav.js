import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import Classes from './nav.module.scss'

export default function Profile() {
  const { user, error, isLoading } = useUser();
  if (isLoading) return <nav className={`${Classes.nav} d-flex justify-content-end py-2 align-items-center container`}>Loading...</nav>;
  if (error) return <nav className={`${Classes.nav} d-flex justify-content-end py-2 align-items-center container`}>{error.message}</nav>;

  return (
    user && (
      <nav className={`${Classes.nav} d-flex justify-content-end py-2 align-items-center container`}>
        <h2 className="h5 mb-0">Hello {user.name}</h2>
        {/* <p>{user.email}</p> */}
        <img className={`h-100 ml-3 ${Classes.avatar}`} src={user.picture} alt={user.name} />
        <a className="ml-3 link-underline" href="/api/auth/logout">Logout</a>
      </nav>
    )
  );
}