import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

const ReviewsSection = ({ machineId }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('token');

  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    rating: '',
    comment: ''
  });

  // Fetch reviews for this machine
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/review/machine/${machineId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    if (machineId) fetchReviews();
  }, [machineId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BASE_URL}/api/review`,
        {
          machineId,
          comment: formData.comment,
          rating: formData.rating,
          ownerId: reviews[0]?.ownerId?._id || '', // optional
          bookingId: reviews[0]?.bookingId?._id || '' // optional
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setFormData({ rating: '', comment: '' });

      // Refresh reviews after submission
      const res = await axios.get(`${BASE_URL}/api/review/machine/${machineId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-10 bg-gray-50 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-4">Reviews</h2>

      {/* Existing Reviews */}
      <div className="mb-6 space-y-3">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border p-4 rounded shadow-sm bg-white">
              <p className="text-lg font-semibold">
                {review.userId?.name || 'Anonymous'}
              </p>
              <p className="text-yellow-500">⭐ {review.rating}</p>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      {/* Add Review */}
      <h2 className="text-2xl font-bold mb-4">Add a Review:</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          id="rating"
          name="rating"
          label="Rating (1–5)"
          variant="standard"
          type="number"
          value={formData.rating}
          onChange={handleChange}
          inputProps={{ min: 1, max: 5 }}
          required
          fullWidth
        />
        <TextField
          id="comment"
          name="comment"
          label="Comment"
          variant="standard"
          multiline
          rows={4}
          value={formData.comment}
          onChange={handleChange}
          required
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Submit Review
        </Button>
      </form>
    </div>
  );
};

export default ReviewsSection;
