import Image from 'next/image';

import StravaButtonPng from './btn_strava_connectwith_orange.svg';

export type StravaLoginButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

/**
 * Must adhere to the Strava Brand Guidelines and use the provided assets
 * https://developers.strava.com/guidelines/
 */
export function StravaLoginButton({ onClick }: StravaLoginButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        margin: 0,
        padding: 0,
        width: '300px',
      }}
    >
      <Image alt="Connect with Strava" src={StravaButtonPng} width={300} />
    </button>
  );
}
