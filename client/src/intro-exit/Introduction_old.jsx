// this still exists just in case my new introduction doesn't work. have to error check before removing.

import React from "react";
import { Button } from "../components/Button";

export function Introduction({ next }) {
  return (
    <div className="mt-3 sm:mt-5 p-20">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Instruction One
      </h3>
      <div className="mt-2 mb-6">
        <p className="text-sm text-gray-500">
          The INTRODUCTION/INSTRUCTIONS for the experiment will go here. We can format this however we'd like. The quick brown fox jumps over the lazy dog.
        </p>
      </div>
      <Button handleClick={next} autoFocus>
        <p>Next</p>
      </Button>
    </div>
  );
}
