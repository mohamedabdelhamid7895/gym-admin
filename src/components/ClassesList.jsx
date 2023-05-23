/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
// /* eslint-disable no-unused-vars */
// /* eslint-disable react/jsx-key */
// /* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

const validationSchema = Yup.object({
    className: Yup.string().required('Class Name is required'),
    coachName: Yup.string().required('Coach Name is required'),
    timing: Yup.string().required('Timing is required'),
    price: Yup.number().required('Price is required'),
});

const ClassesList = () => {
    const [classes, setClasses] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState(null);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [classToDeleteId, setClassToDeleteId] = useState(null);

    const deleteClass = async (classId) => {
        setClassToDeleteId(classId);
        setShowDeleteConfirmation(true);
    };

    const confirmDeleteClass = async () => {
        try {
            await axios.delete(`https://64103182e1212d9cc92c334f.mockapi.io/api/gym/classes/${classToDeleteId}`);
            fetchClasses();
            closeDeleteConfirmation();
        } catch (error) {
            console.error(error);
        }
    };

    const closeDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
        setClassToDeleteId(null);
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await axios.get('https://64103182e1212d9cc92c334f.mockapi.io/api/gym/classes');
            setClasses(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const openAddEditDialog = (classId = null) => {
        setSelectedClassId(classId);
        setOpenDialog(true);
    };

    const closeAddEditDialog = () => {
        setOpenDialog(false);
        setSelectedClassId(null);
    };

    const addEditClass = async (classData) => {
        try {
            if (selectedClassId) {
                await axios.put(
                    `https://64103182e1212d9cc92c334f.mockapi.io/api/gym/classes/${selectedClassId}`,
                    classData
                );
            } else {
                await axios.post('https://64103182e1212d9cc92c334f.mockapi.io/api/gym/classes', classData);
            }
            fetchClasses();
            closeAddEditDialog();
        } catch (error) {
            console.error(error);
        }
    };

    const columns = React.useMemo(
        () => [
            { Header: 'Class Name', accessor: 'className' },
            { Header: 'Coach Name', accessor: 'coachName' },
            { Header: 'Timing', accessor: 'timing' },
            { Header: 'Price', accessor: 'price' },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <>
                        <Button variant="outlined" color="primary" onClick={() => openAddEditDialog(row.original.id)} style={{ marginRight: '10px' }}>
                            Edit
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => deleteClass(row.original.id)}>
                            Delete
                        </Button>
                    </>
                ),
            },
        ],
        []
    );

    const tableInstan = useTable({ columns, data: classes });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = tableInstan;

    return (
        <>

            <TableContainer component={Paper} sx={{ marginBottom: '20px' }}>
                <Table {...getTableProps()}>
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <TableCell {...column.getHeaderProps()}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {column.render('Header')}
                                        </Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <TableRow {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <TableCell {...cell.getCellProps()}>
                                            {cell.column.Header === 'Actions' ? (
                                                <>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => openAddEditDialog(row.original.id)}
                                                        style={{marginRight:''}}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => deleteClass(row.original.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </>
                                            ) : (
                                                    <Link to={`/classes/${row.original.id}`}>
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

            <Button variant="outlined" color="primary" onClick={() => openAddEditDialog()}>
                Add Class
            </Button>


            <Dialog open={showDeleteConfirmation} onClose={closeDeleteConfirmation} maxWidth="sm" fullWidth>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to delete this class?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmDeleteClass} color="secondary">
                        Delete
                    </Button>
                    <Button onClick={closeDeleteConfirmation} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDialog} onClose={closeAddEditDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedClassId ? 'Edit Class' : 'Add Class'}</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            className: '',
                            coachName: '',
                            timing: '',
                            price: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            addEditClass(values);
                        }}
                    >
                        {(formikProps) => (
                            <Form>
                                <div>
                                    <Field
                                        name="className"
                                        as={TextField}
                                        label="Class Name"
                                        error={formikProps.errors.className && formikProps.touched.className}
                                        helperText={<ErrorMessage name="className" />}
                                    />
                                </div>
                                <div>
                                    <Field
                                        name="coachName"
                                        as={TextField}
                                        label="Coach Name"
                                        error={formikProps.errors.coachName && formikProps.touched.coachName}
                                        helperText={<ErrorMessage name="coachName" />}
                                    />
                                </div>
                                <div>
                                    <Field
                                        name="timing"
                                        as={TextField}
                                        label="Timing"
                                        error={formikProps.errors.timing && formikProps.touched.timing}
                                        helperText={<ErrorMessage name="timing" />}
                                    />
                                </div>
                                <div>
                                    <Field
                                        name="price"
                                        as={TextField}
                                        label="Price"
                                        type="number"
                                        error={formikProps.errors.price && formikProps.touched.price}
                                        helperText={<ErrorMessage name="price" />}
                                    />
                                </div>
                                <DialogActions>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        disabled={!formikProps.isValid || formikProps.isSubmitting}
                                    >
                                        {selectedClassId ? 'Save Changes' : 'Add Class'}
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


        </>
    );
};

export default ClassesList;





