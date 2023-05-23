import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Paper,
    Typography,
} from '@mui/material';

const ClientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editData, setEditData] = useState({
        full_name: '',
        mobile_number: '',
        address: '',
        subscription_type: '',
    });

    useEffect(() => {
        fetchClientDetails();
    }, []);

    const fetchClientDetails = async () => {
        try {
            const response = await axios.get(
                `https://64103182e1212d9cc92c334f.mockapi.io/api/gym/clients/${id}`
            );
            setClient(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditDialogOpen = () => {
        setEditData({
            full_name: client.full_name,
            mobile_number: client.mobile_number,
            address: client.address,
            subscription_type: client.subscription_type,
        });
        setOpenDialog(true);
    };

    const handleEditDialogClose = () => {
        setOpenDialog(false);
    };

    const handleEditDataChange = (event) => {
        const { name, value } = event.target;
        setEditData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleEditClient = async () => {
        try {
            await axios.put(
                `https://64103182e1212d9cc92c334f.mockapi.io/api/gym/clients/${id}`,
                editData
            );
            fetchClientDetails();
            handleEditDialogClose();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteClient = async () => {
        try {
            await axios.delete(
                `https://64103182e1212d9cc92c334f.mockapi.io/api/gym/clients/${id}`
            );
            navigate('/clients');
        } catch (error) {
            console.error(error);
        }
    };

    if (!client) {
        return <div>Loading...</div>;
    }

    return (
        <Paper elevation={3} sx={{ padding: '20px', margin: '20px', maxWidth: '90%' }}>
            <Avatar src={client.avatar} alt={client.full_name} sx={{ marginTop: '30px',left:'50%' }} />
            <Typography variant="h4" sx={{ marginTop: '10px' }}>
                {client.full_name}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                Mobile Number: {client.mobile_number}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                Address: {client.address}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '10px' }}>
                Subscription Type: {client.subscription_type}
            </Typography>

            <Button variant="outlined" color="primary" onClick={handleEditDialogOpen} sx={{ marginRight: '20px' }}>
                Edit
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleDeleteClient}>
                Delete
            </Button>

            <Dialog open={openDialog} onClose={handleEditDialogClose}>
                <DialogTitle>Edit Client</DialogTitle>
                <DialogContent>
                    <TextField
                        name="full_name"
                        label="Full Name"
                        value={editData.full_name}
                        onChange={handleEditDataChange}
                        fullWidth
                    />
                    <TextField
                        name="mobile_number"
                        label="Mobile Number"
                        value={editData.mobile_number}
                        onChange={handleEditDataChange}
                        fullWidth
                    />
                    <TextField
                        name="address"
                        label="Address"
                        value={editData.address}
                        onChange={handleEditDataChange}
                        fullWidth
                    />
                    <TextField
                        name="subscription_type"
                        label="Subscription Type"
                        value={editData.subscription_type}
                        onChange={handleEditDataChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditClient} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default ClientDetails;
