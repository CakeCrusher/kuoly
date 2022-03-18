import React, { forwardRef } from "react";

const style = {
  width: "400px",
  height: "75px",
  border: "1px solid red",
};

export const Item = forwardRef(({ id, ...props }: any, ref) => {
  return (
    <div ref={ref} style={style} {...props}>
      {id}
    </div>
  );
});
