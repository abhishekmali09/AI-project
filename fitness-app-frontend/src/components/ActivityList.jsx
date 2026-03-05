import {Grid, Typography,Card, CardContent} from '@mui/material';
import React, { useEffect, useState } from 'react' 
import { useNavigate } from 'react-router';

import { getActivities } from '../services/api';


const ActivityList = () => {
 
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();

    const fetchActivities = async () => {
     try {
         const response = await getActivities();
         setActivities(response.data);

             
     }
      catch (error) {
          console.error("Error fetching activities:", error);
      }
    };
    useEffect(() => {
        fetchActivities();
    } , []);
     return (
    <Grid container spacing={2}>
        {activities.map((activity) => (
            <Grid container spacing={2} xs={12} md={6} lg={4} key={activity.id}>
               <Card sx={{ cursor: 'pointer' }}>
                  <div onClick={() => navigate(`/activities/${activity.id}`)}>
                    <CardContent>
                        <Typography variant="h5">{activity.type}</Typography>
                        <Typography variant="body1">Duration: {activity.duration} minutes</Typography>
                        <Typography variant="body1">Calories Burned: {activity.caloriesBurned}</Typography>
                    </CardContent>
                  </div>
                
            </Card>
            </Grid>
        ))}
     
    </Grid>
    
  )
}

export default ActivityList