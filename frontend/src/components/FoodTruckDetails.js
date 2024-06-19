import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.7); /* White background with transparency */
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.main};
  border-radius: 8px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
`;

const Button = styled.button`
  margin: 10px 0;
`;

const ReviewForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin: 5px 0;
`;

const Input = styled.input`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px;
  border-radius: 4px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px;
  border-radius: 4px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FoodTruckDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodTruck, setFoodTruck] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/foodtrucks/${id}`)
      .then(response => setFoodTruck(response.data))
      .catch(error => console.error('Error fetching food truck details:', error));
    
    axios.get(`${process.env.REACT_APP_API_URL}/reviews/${id}`)
      .then(response => setReviews(response.data))
      .catch(error => console.error('Error fetching reviews:', error));
  }, [id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const rating = parseInt(newReview.rating, 10);
    if (rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5');
      return;
    }
    axios.post(`${process.env.REACT_APP_API_URL}/reviews`, { ...newReview, rating, food_truck_id: id })
      .then(response => {
        setReviews(prevReviews => [...prevReviews, response.data.review]); // Update the reviews state
        setNewReview({ rating: '', comment: '' }); // Reset form
        setError('');
      })
      .catch(error => {
        setError('Error submitting review');
        console.error('Error submitting review:', error);
      });
  };

  const handleAddFavorite = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/favorites`, { user_id: 'user123', food_truck_id: id })
      .then(response => console.log('Favorite added:', response.data))
      .catch(error => console.error('Error adding favorite:', error));
  };

  if (!foodTruck) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Button onClick={() => navigate('/')}>Return</Button>
      <Title>{foodTruck.applicant}</Title>
      <p>{foodTruck.address}</p>
      <p>{foodTruck.fooditems}</p>
      <p>{foodTruck.dayshours}</p>
      <Button onClick={handleAddFavorite}>Add to Favorites</Button>
      <h2>Reviews</h2>
      <ul>
        {reviews.map(review => (
          <li key={review._id}>
            <strong>Rating:</strong> {review.rating}<br />
            <strong>Comment:</strong> {review.comment}
          </li>
        ))}
      </ul>
      <h3>Add a Review</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ReviewForm onSubmit={handleReviewSubmit}>
        <Label>
          Rating:
          <Input
            type="number"
            name="rating"
            value={newReview.rating}
            onChange={handleReviewChange}
            required
            min="1"
            max="5"
          />
        </Label>
        <Label>
          Comment:
          <TextArea
            name="comment"
            value={newReview.comment}
            onChange={handleReviewChange}
            required
          />
        </Label>
        <Button type="submit">Submit</Button>
      </ReviewForm>
    </Container>
  );
};

export default FoodTruckDetails;