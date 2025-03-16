import React, { useState } from 'react';
import { Avatar, Button, Card, CardContent, Typography, Box } from '@mui/material';
import { useSwipeable } from 'react-swipeable';
import './FriendOffers.css'; // Import the CSS file for smooth transitions

const FriendOffers = () => {
    const [friendOffers] = useState([
        { id: 1, avatar: 'https://via.placeholder.com/150', username: 'John Doe' },
        { id: 2, avatar: 'https://via.placeholder.com/150', username: 'Jane Smith' },
        { id: 3, avatar: 'https://via.placeholder.com/150', username: 'Alice Johnson' },
        { id: 4, avatar: 'https://via.placeholder.com/150', username: 'Bob Brown' },
        { id: 5, avatar: 'https://via.placeholder.com/150', username: 'Charlie Davis' },
        { id: 6, avatar: 'https://via.placeholder.com/150', username: 'Diana Evans' },
    ]);

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleAddFriend = (id) => {
        // Implement the logic to add a friend
        console.log(`Add friend with id: ${id}`);
    };

    const handleSwipeLeft = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % friendOffers.length);
    };

    const handleSwipeRight = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + friendOffers.length) % friendOffers.length);
    };

    const handlers = useSwipeable({
        onSwipedLeft: handleSwipeLeft,
        onSwipedRight: handleSwipeRight,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    return (
        <div {...handlers} className="friend-offers-container">
            <Button onClick={handleSwipeRight} className="nav-button">{"<"}</Button>
            <Box className="friend-offers">
                {friendOffers.slice(currentIndex, currentIndex + 3).map((offer) => (
                    <Card key={offer.id} className="friend-offer-card">
                        <CardContent>
                            <Avatar src={offer.avatar} className="avatar" />
                            <Typography variant="h5" component="div">
                                {offer.username}
                            </Typography>
                            <Button variant="contained" color="primary" onClick={() => handleAddFriend(offer.id)}>
                                Add Friend
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Box>
            <Button onClick={handleSwipeLeft} className="nav-button">{">"}</Button>
        </div>
    );
};

export default FriendOffers;