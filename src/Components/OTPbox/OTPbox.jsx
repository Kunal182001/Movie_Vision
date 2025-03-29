import React, { useRef, useState } from 'react';

const OTPbox = ({ length = 4, onComplete }) => {
  const inputRefs = useRef([]);
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (e, index) => {
    const { value } = e.target;

    // Allow only digits
    if (!/^\d*$/.test(value)) {
      setIsValid(false);
      setTimeout(() => setIsValid(true), 1000);
      return;
    }

    setIsValid(true);

    // Move to the next input field
    if (value.length === 1 && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Trigger onComplete if all fields are filled
    if (value.length === 1 && index === length - 1) {
      const otp = inputRefs.current.map(input => input.value).join('');
      if (otp.length === length) {
        onComplete && onComplete(otp);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(pasteData)) {
      setIsValid(false);
      setTimeout(() => setIsValid(true), 1000);
      return;
    }

    pasteData.split('').forEach((char, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = char;
      }
    });

    if (pasteData.length === length) {
      onComplete && onComplete(pasteData);
    }
  };

  return (
    <div className="flex justify-center gap-4 mt-8">
      {[...Array(length)].map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength="1"
          ref={el => (inputRefs.current[i] = el)}
          className={`w-12 h-12 text-xl font-bold text-center border-2 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 ${
            isValid ? 'border-gray-300' : 'border-red-500 animate-shake'
          }`}
          onChange={(e) => handleInputChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default OTPbox;
