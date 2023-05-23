import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Paper, Box } from '@mui/material';

const ClassPreviewPage = () => {
    const [classData, setClassData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const response = await axios.get(`https://64103182e1212d9cc92c334f.mockapi.io/api/gym/classes/${id}`);
                setClassData(response.data);
            } catch (error) {
                console.error('Error fetching class data:', error);
            }
        };

        fetchClassData();
    }, [id]);

    if (!classData) {
        return <div>Loading...</div>;
    }

    const { title, coach_name, timing, price, description, coach_brief } = classData;

    return (
        <Paper elevation={3} sx={{ padding: '20px', margin: '20px', maxWidth: '90%' }}>
            <Typography variant="h2" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Coach: {coach_name}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Timing: {timing}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Price: ${price}
            </Typography>
            <Box sx={{ marginTop: '20px' }}>
                <Typography variant="body2">{description}</Typography>
                <Typography variant="body2">Coach Brief: {coach_brief}</Typography>
            </Box>
        </Paper>
    );
};

export default ClassPreviewPage;
