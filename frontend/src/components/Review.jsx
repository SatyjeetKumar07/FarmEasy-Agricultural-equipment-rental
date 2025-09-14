import React from "react";

const Review = ({ profilePicture, name, postingTime, starRating, reviewText }) => {
  return (
    <div className="review-item flex space-x-4 bg-white p-4 rounded-lg shadow hover:shadow-md transition">
      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-300">
        <img src={profilePicture} alt={name} className="h-full w-full object-cover" />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold">{name}</h4>
          <span className="text-xs text-gray-400">{postingTime}</span>
        </div>
        <div className="flex text-yellow-400 mb-1">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i}>{i < starRating ? "★" : "☆"}</span>
          ))}
        </div>
        <p className="text-gray-700">{reviewText}</p>
      </div>
    </div>
  );
};

export default Review;
