import React, { useRef, useEffect } from "react";

import "./CalendarInput.less";

type Props = {
  isEditing: boolean;
  value: string | undefined | null | Date;
  handleOnSubmit: (date: string) => void;
};

const CalendarInput: React.FC<Props> = ({
  isEditing,
  value,
  handleOnSubmit,
}) => {
  // transform date to a valid format
  let date = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let newValue: string | null | undefined;
    if (value) {
      newValue = new Date(value).toISOString();
      newValue = newValue.split("T")[0];
      console.log("newValue: ", newValue);
    }
    if (date.current && typeof newValue === "string") {
      date.current.value = newValue ? newValue : "";
    }
  }, [value]);
  const handleOnKeyPress = (e: any) => {
    if (date.current && e.key === "Enter") {
      date.current.blur();
      handleOnSubmit(new Date(date.current.value).toISOString());
    }
  };
  // transform value to format MM/DD/YYYY
  let valueToDisplay: any = value
    ? new Date(value).toISOString()
    : "No date selected";
  valueToDisplay = valueToDisplay.split("T")[0].split("-");
  valueToDisplay = [
    valueToDisplay[1],
    valueToDisplay[2],
    valueToDisplay[0],
  ].join("/");

  return (
    <div className="calendar-input">
      <input
        ref={date}
        className={`${isEditing ? "" : "hidden"}`}
        type="date"
        onKeyPress={handleOnKeyPress}
        onBlur={(e) => handleOnSubmit(new Date(e.target.value).toISOString())}
      />
      <div className={`${isEditing || (!isEditing && !value) ? "hidden" : ""}`}>
        {value ? valueToDisplay : "No date selected"}
      </div>
    </div>
  );
};

export default CalendarInput;
