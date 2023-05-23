/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import { Link } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    Typography,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    phone: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]+$/, 'Phone number must contain only digits'),
    address: Yup.string().required('Address is required'),
    subscriptionType: Yup.string().required('Subscription type is required'),
});

const ClientsList = () => {
    const [clients, setClients] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get('https://64103182e1212d9cc92c334f.mockapi.io/api/gym/clients');
            setClients(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteClient = async (clientId) => {
        setClientToDelete(clientId);
        setDeleteConfirmation(true);
    };

    const confirmDeleteClient = async () => {
        try {
            await axios.delete(`https://64103182e1212d9cc92c334f.mockapi.io/api/gym/clients/${clientToDelete}`);
            fetchClients();
            closeDeleteConfirmation();
        } catch (error) {
            console.error(error);
        }
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmation(false);
        setClientToDelete(null);
    };

    const openAddEditDialog = (clientId = null) => {
        setSelectedClientId(clientId);
        setOpenDialog(true);
    };

    const closeAddEditDialog = () => {
        setOpenDialog(false);
        setSelectedClientId(null);
    };

    const addEditClient = async (clientData) => {
        try {
            if (selectedClientId) {
                await axios.put(
                    `https://64103182e1212d9cc92c334f.mockapi.io/api/gym/clients/${selectedClientId}`,
                    clientData
                );
            } else {
                await axios.post('https://64103182e1212d9cc92c334f.mockapi.io/api/gym/clients', clientData);
            }
            fetchClients();
            closeAddEditDialog();
        } catch (error) {
            console.error(error);
        }
    };

    const columns = React.useMemo(
        () => [
            { Header: 'Name', accessor: 'name' },
            { Header: 'Phone Number', accessor: 'phone' },
            { Header: 'Address', accessor: 'address' },
            { Header: 'Subscription Type', accessor: 'subscriptionType' },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
          <>
                        <Button
                            variant="outlined"
                            style={{ marginRight: '15px' }}
                            color="primary"
                            onClick={() => openAddEditDialog(row.original.id)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => deleteClient(row.original.id)}
                        >
                            Delete
                        </Button>
                    </>
                ),
            },
        ],
        []
    );

    const tableInstance = useTable({ columns, data: clients });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = tableInstance;

    return (
        <div>
            <TableContainer component={Paper}>
                <Table {...getTableProps()}>
                    <TableHead>
                        {headerGroups.map(headerGroup => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <TableCell {...column.getHeaderProps()} style={{ border: '1px solid black' }}>
                                        {column.render('Header')}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {rows.map(row => {
                            prepareRow(row);
                            const clientID = row.original.id;

                            return (
                                <TableRow {...row.getRowProps()} style={{ cursor: 'pointer' }}>
                                    {row.cells.map((cell) => (
                                        <TableCell {...cell.getCellProps()} style={{ border: '1px solid #aaaaaa' }}>
                                            {cell.column.Header === 'Actions' ? (
                                                <>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => openAddEditDialog(row.original.id)}
                                                        style={{ marginRight: '10px' }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button variant="outlined" color="secondary" onClick={() => deleteClient(row.original.id)}>
                                                        Delete
                                                    </Button>
                                                </>
                                            ) : (
                                                    <Link to={`/clients/${row.original.id}`}>
                                                    <Typography variant="body1">{cell.render('Cell')}</Typography>
                                                </Link>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button
                variant="outlined"
                color="primary"
                onClick={() => openAddEditDialog()}
                style={{ marginTop: '15px', marginBottom: '20px' }}
            >
                Add Client
            </Button>

            <Dialog open={openDialog} onClose={closeAddEditDialog}>
                <DialogTitle>{selectedClientId ? 'Edit Client' : 'Add Client'}</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            name: '',
                            phone: '',
                            address: '',
                            subscriptionType: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={values => {
                            addEditClient(values);
                        }}
                    >
                        {formikProps => (
                            <Form>
                                <div>
                                    <Field
                                        name="name"
                                        as={TextField}
                                        label="Name"
                                        error={formikProps.errors.name && formikProps.touched.name}
                                        helperText={<ErrorMessage name="name" />}
                                    />
                                </div>
                                <div>
                                    <Field
                                        name="phone"
                                        as={TextField}
                                        label="Phone Number"
                                        error={formikProps.errors.phone && formikProps.touched.phone}
                                        helperText={<ErrorMessage name="phone" />}
                                    />
                                </div>
                                <div>
                                    <Field
                                        name="address"
                                        as={TextField}
                                        label="Address"
                                        error={formikProps.errors.address && formikProps.touched.address}
                                        helperText={<ErrorMessage name="address" />}
                                    />
                                </div>
                                <div>
                                    <Field
                                        name="subscriptionType"
                                        as={TextField}
                                    label="Subscription Type"
                                        error={
                                            formikProps.errors.subscriptionType &&
                                            formikProps.touched.subscriptionType
                                        }
                                        helperText={<ErrorMessage name="subscriptionType" />}
                                    />
                                </div>
                                <DialogActions>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        disabled={!formikProps.isValid || formikProps.isSubmitting}
                                    >
                                        {selectedClientId ? 'Save Changes' : 'Add Client'}
                                    </Button>
                                    <Button onClick={closeAddEditDialog} color="secondary">
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
 
            <Dialog open={deleteConfirmation} onClose={closeDeleteConfirmation}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this client?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmDeleteClient} color="secondary">
                        Delete
                    </Button>
                    <Button onClick={closeDeleteConfirmation} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog> 
        </div>
    );
};

export default ClientsList;
