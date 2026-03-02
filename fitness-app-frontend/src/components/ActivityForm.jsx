import { FormControl } from '@mui/material';
import React from 'react'
import { useState } from 'react';
import { Box, Button, InputLabel, MenuItem, Select, TextField } from '@mui/material';





const ActivityForm = ( onActivitiesAdded) => {

  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: '',
    caloriesBurned: '',
    additionalMetrics: {}
  });

  const handleSubmit = async(event) => {
  event.preventDefault();
  try {
    await addActivity({ activity });
    onActivitiesAdded();
    setActivity({ type: "RUNNING", duration: '', caloriesBurned: '' });
}
catch (error) {
    console.error("Error adding activity:", error);
}
}


  return (
       <Box component="form" onSubmit={handleSubmit} sx={{md:4}} >


           <FormControl fullWidth sx={{mb:2}}>
                <InputLabel id="activity-type-label">Activity Type</InputLabel>
                <Select

                value={activity.type}
                onChange={(e) => setActivity({...activity, type: e.target.value})}
                >
                    <MenuItem value="RUNNING">Running</MenuItem>
                    <MenuItem value="CYCLING">Cycling</MenuItem>
                    <MenuItem value="SWIMMING">Swimming</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Duration (minutes)"
                type="number"
                sx={{mb:2}}
                value={activity.duration}
                onChange={(e) => setActivity({...activity, duration: e.target.value})}
            />
            <TextField fullWidth
                label="Calories Burned"
                type="number"
                sx={{mb:2}}
                value={activity.caloriesBurned}
                onChange={(e) => setActivity({...activity, caloriesBurned: e.target.value})}  
            />

            <Button type="submit" variant="contained" color="primary">
                Add Activity
            </Button>
  </Box>
  )
}

export default ActivityForm