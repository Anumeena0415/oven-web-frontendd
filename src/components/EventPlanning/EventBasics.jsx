import React, { useState, useEffect, useCallback } from "react";
import { Heart, Cake, Building2, Gift, Baby, Palette } from "lucide-react";
import Autocomplete from "@mui/material/Autocomplete";

const EventBasics = ({ formData, setFormData, title, onValidationChange }) => {
  const [cityOptions, setCityOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [dateError, setDateError] = useState("");
  const [dateTouched, setDateTouched] = useState(false);

  const eventTypes = [
    { name: "Wedding", icon: Heart },
    { name: "Birthday Party", icon: Cake },
    { name: "Corporate Event", icon: Building2 },
    { name: "Anniversary", icon: Gift },
    { name: "Baby Shower", icon: Baby },
    { name: "Theme Party", icon: Palette },
  ];

  // ✅ Check if title matches one of the event types
  const isTitleValid = eventTypes.some(
    (event) => event.name === title
  );

  // ✅ Automatically set event type only if title matches
  useEffect(() => {
    if (isTitleValid) {
      setFormData((prev) => ({ ...prev, eventType: title }));
    }
  }, [title, isTitleValid, setFormData]);

  // ✅ Debounced city fetching
  useEffect(() => {
    if (inputValue.length < 2) {
      setCityOptions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(
        `${
          import.meta.env.VITE_BACKEND_URL ||
          "https://ovevents.onrender.com"
        }/api/cities?q=${encodeURIComponent(inputValue)}`,
        { signal: controller.signal }
      )
        .then((res) => res.json())
        .then((data) => setCityOptions(data.map((place) => place.display_name)))
        .catch((err) => {
          if (err.name !== "AbortError") console.error("City fetch failed:", err);
        });
    }, 1000);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [inputValue]);

  // Get today's date in YYYY-MM-DD format for min attribute
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Validate date
  const validateDate = (dateValue) => {
    if (!dateValue || dateValue.trim() === "") {
      return "Event Date is required";
    }
    const selectedDate = new Date(dateValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates only
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return "Event date cannot be in the past. Please select a future date.";
    }
    return "";
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setFormData({ ...formData, date: dateValue });
    
    if (dateTouched) {
      const error = validateDate(dateValue);
      setDateError(error);
    }
  };

  const handleDateBlur = () => {
    setDateTouched(true);
    const error = validateDate(formData.date);
    setDateError(error);
  };

  // Check if date is valid
  const isDateValid = useCallback(() => {
    const error = validateDate(formData.date);
    return error === "";
  }, [formData.date]);

  // Validate date and show errors
  const validateDateField = useCallback(() => {
    setDateTouched(true);
    const error = validateDate(formData.date);
    setDateError(error);
  }, [formData.date]);

  // Expose validation to parent component
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isDateValid(), validateDateField);
    }
  }, [formData.date, isDateValid, validateDateField, onValidationChange]);

  return (
    <div className="bg-white rounded-2xl mt-4 p-3">
      <h2 className="text-2xl font-bold text-center">Event Basics</h2>
      <p className="text-center text-gray-500">Tell us about your event</p>

      {/* Event Type Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {eventTypes.map(({ name, icon: Icon }) => (
          <button
            key={name}
            disabled={isTitleValid} // ✅ Disable manual click if auto-selected by title
            onClick={() => {
              if (!isTitleValid) {
                setFormData({ ...formData, eventType: name });
              }
            }}
            className={`cursor-pointer border rounded-xl px-1 py-5 flex flex-col items-center justify-center transition ${
              formData.eventType === name
                ? "border-2 border-[#E69B83] bg-orange-50 text-orange-500"
                : "border-gray-300 hover:border-2 hover:border-[#E69B83]"
            }`}
          >
            <Icon className="w-6 h-6 mb-2" />
            <span>{name}</span>
          </button>
        ))}
      </div>

      {/* Event Date & City */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="block text-lg font-medium mb-1">Event Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={handleDateChange}
            onBlur={handleDateBlur}
            min={getTodayDate()}
            className={`w-full outline-1 rounded-lg p-2 focus:outline-2 focus:outline-[#E69B83] ${
              dateTouched && dateError ? "border-red-500 border-2" : ""
            }`}
          />
          {dateTouched && dateError && (
            <p className="text-red-500 text-sm mt-1">{dateError}</p>
          )}
        </div>

        <div>
          <label className="block text-lg font-medium mb-1">City</label>
          <Autocomplete
            freeSolo
            options={cityOptions}
            inputValue={inputValue}
            onInputChange={(e, newInputValue) => setInputValue(newInputValue)}
            value={formData.city}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <input
                  type="text"
                  {...params.inputProps}
                  placeholder="Select your city"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="outline-1 hover:outline-2 hover:outline-[#E69B83] rounded-lg px-4 py-2 w-full"
                />
              </div>
            )}
          />
        </div>
      </div>

      {/* Guest Count */}
      <div>
        <label className="block text-lg font-medium mt-6 mb-1">
          Expected Guest Count: {formData.guests}
        </label>
        <input
          type="range"
          min="10"
          max="500"
          value={formData.guests}
          onChange={(e) =>
            setFormData({ ...formData, guests: e.target.value })
          }
          className="w-full accent-[#c16a4d]"
        />
        <div className="flex justify-between font-semibold text-sm text-gray-500">
          <span>10</span>
          <span>500+</span>
        </div>
      </div>
    </div>
  );
};

export default EventBasics;
