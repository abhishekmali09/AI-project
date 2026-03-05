import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { getActivityById, getActivityDetail } from '../services/api';

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch activity details
        const activityResponse = await getActivityById(id);
        setActivity(activityResponse.data);

        // Fetch AI recommendation (may not exist yet)
        try {
          const recResponse = await getActivityDetail(id);
          setRecommendation(recResponse.data);
        } catch (recError) {
          console.warn("Recommendation not available yet:", recError);
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
        setError("Failed to load activity details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!activity) {
    return <Typography>No activity data found.</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h5">{activity.type}</Typography>
          <Typography variant="body1">Duration: {activity.duration} minutes</Typography>
          <Typography variant="body1">Calories Burned: {activity.caloriesBurned}</Typography>
          <Typography variant="body1">Start Time: {new Date(activity.startTime).toLocaleString()}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Additional Metrics:</Typography>
          {activity.additionalMetrics && Object.entries(activity.additionalMetrics).map(([key, value]) => (
            <Typography key={key} variant="body2">{key}: {value}</Typography>
          ))}
        </CardContent>
      </Card>

      {recommendation && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h5">AI Recommendations:</Typography>
            <Typography variant="body1">Based on your activity, here are some personalized AI recommendations:</Typography>
            <Typography sx={{ whiteSpace: 'pre-line', mt: 1 }}>{recommendation.recommendation}</Typography>

            <Divider sx={{ mt: 2, mb: 2 }} />
            <Typography variant="h6">Improvements</Typography>
            {recommendation.improvments?.map((improvement, index) => (
              <Typography key={index} sx={{ mt: 1 }}>{improvement}</Typography>
            ))}

            <Divider sx={{ mt: 2, mb: 2 }} />
            <Typography variant="h6">Suggestions</Typography>
            {recommendation.suggerstion?.map((suggestion, index) => (
              <Typography key={index} sx={{ mt: 1 }}>{suggestion}</Typography>
            ))}

            <Divider sx={{ mt: 2, mb: 2 }} />
            <Typography variant="h6">Safety Guidelines</Typography>
            {recommendation.safety?.map((item, index) => (
              <Typography key={index} sx={{ mt: 1 }}>{item}</Typography>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ActivityDetail;