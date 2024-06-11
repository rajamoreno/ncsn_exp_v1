// MyConsent.jsx

import React from "react";
import { Consent } from "@empirica/core/player/react";

export function MyConsent({ onConsent }) {
  return (
    <Consent
      title="Are you ready to enter your Prolific ID?"
      text=""
      buttonText="Yes!"
      onConsent={onConsent}
    />
  );
}