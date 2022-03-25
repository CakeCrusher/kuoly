import React from "react";
import { useMarkedForDeletion, useRemoveMFD } from "../../state/store";

import "./UndoNotification.less";

const UndoNotification = () => {
  const { markedForDeletion } = useMarkedForDeletion();
  const { setRemoveMFD } = useRemoveMFD();
  return (
    <div className="f-col f-center notification-container">
      {markedForDeletion.map((mfd) => (
        <div key={mfd.id} className="undo-container">
          {mfd.text}{" "}
          <button
            onClick={() => {
              clearTimeout(mfd.timeout);
              setRemoveMFD({ id: mfd.id, isUndo: true });
            }}
            className="undo-button"
          >
            Undo
          </button>
        </div>
      ))}
    </div>
  );
};

export default UndoNotification;
