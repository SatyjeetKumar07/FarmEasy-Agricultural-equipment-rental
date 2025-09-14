import React from "react";
import { useNavigate } from "react-router-dom";

const MachineCardOwner = ({ machine, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
      <div className="h-40 w-full mb-4 overflow-hidden rounded">
        {machine.img?.length > 0 && (
          <img
            src={`data:${machine.img[0].contentType};base64,${btoa(
              new Uint8Array(machine.img[0].data.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            )}`}
            alt={machine.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <h3 className="text-lg font-bold mb-2">{machine.name}</h3>
      <p className="text-sm mb-2">Status: {machine.availability}</p>
      <p className="text-sm mb-4">Price: ₹{machine.rentalPrice}</p>
      <div className="mt-auto flex justify-between">
        <button
          onClick={() => navigate(`/update_machine/${machine._id}`)}
          className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(machine._id)}
          className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MachineCardOwner;
