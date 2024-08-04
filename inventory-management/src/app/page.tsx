'use client' 


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react'
import { Box, Container, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase' 
import { 
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	deleteDoc,
	getDoc,
	QuerySnapshot,
	DocumentData,
	DocumentReference,
} from 'firebase/firestore' 
import styles from './styles/styles.module.css'





// defining document data
interface InventoryItem {
	id: string;
	name: string;
	quantity: number; 
}



 export default function Home() { 
	const [inventory, setInventory] = useState([])
	

	// loads the inventory from firebase into the inventory defiend above 
	const updateInventory = async () => {
		try {
			const snapshot: QuerySnapshot<DocumentData> = await getDocs(query(collection(firestore, 'inventory')))
			const inventoryList: InventoryItem[] = []
			snapshot.forEach((doc) => {
				const data = doc.data() as InventoryItem
				inventoryList.push({ id: doc.id, ...data })
			})
			setInventory(inventoryList)
			console.log('test database connection - Inventory:', inventoryList)
		} catch (error) {
			console.error('Error fetching inventory:', error)
		}
	}

	
	// testing function 
	const getLatestID = () => {
		if (inventory.length === 0) {
			console.log('Inventory is empty');
			return null;
		}
		// Find the item with the highest ID
		const latestItem = inventory.reduce((max, item) => {
			return (item.id > max.id) ? item : max;
		}, inventory[0]);
		return latestItem;
	};



	useEffect(() => {
		updateInventory()
	}, [])


	const [newItem, setNewItem] = useState({ id: '', name: '', quantity: '' });

	// whatever value is in the search bar 
    const [searchTerm, setSearchTerm] = useState('');


	// used for filtering whatever is in search bar against the table
	const [searchQuery, setSearchQuery] = useState('');

	const handleSearchChange = (event) => {
		const value = event.target.value;
    	setSearchTerm(value); // Update the state
		setSearchQuery(event.target.value);
	};

	// the filtering is done here. empty search bar displays whole table 
	const filteredInventory = inventory.filter((item) =>
		item.name.toLowerCase().includes(searchQuery.toLowerCase())
	);


	// item addition form is initially invisible 
	const [showItemForm, setShowItemForm] = useState(false)

	// show the form if 'Add Item' is clicked 
	const handleAddItemClick = () => {
		setName(searchTerm);
		setQuantity(1);
		setShowItemForm(true)
	};

	// hide the form if cancel is clicked 
	const handleClear = () => {
		// reset the values
		setName('');
		setQuantity('');
		setSearchTerm('');
		setShowItemForm(false)
	}

	// values for adding a new item 
	const [name, setName] = useState('');
	const [quantity, setQuantity] = useState('');

	
	// adding a new document to database in reaction to button
	const handleSubmit = async () => {
		const date = new Date().toISOString(); 
		const formattedDate =  date.slice(0,-5).replace('T',' ');

		// Logic to handle the form submission
		console.log('Item Name:', name);
		console.log('Quantity:', quantity);
		const docRef = doc(collection(firestore, 'inventory'), formattedDate)

		const docSnap = await getDoc(docRef)
		if (docSnap.exists()) {
			const { quantity } = docSnap.data()
			await setDoc(docRef, {name: name, quantity: quantity + 1 })
		} else {
			await setDoc(docRef, {name: name, quantity: 1 })
		}
		await updateInventory()

		// Clear form
		setName('');
		setQuantity('');
	};


	// mapping each button inside table row to function  
	const handleButtonClick = async (action, row) => {
		// `action` can be "increase", "decrease", or "remove"
		// `row` is the current row data

		console.log(action, row); // Example action and row data handling

		// Implement your logic based on the action type
		if (action === 'increase') {
			const docRef = doc(collection(firestore, 'inventory'), row.id)
			const docSnap = await getDoc(docRef)	
			console.log("Doc Snap: ", docSnap); 
			setDoc(docRef, {name: row.name, quantity: row.quantity + 1});
		} 
		else if (action === 'decrease') {
			const updatedQuantity = row.quantity - 1 >= 0 ? row.quantity - 1 : row.quantity;
			const docRef = doc(collection(firestore, 'inventory'), row.id)
			const docSnap = await getDoc(docRef)	
			console.log("Doc Snap: ", docSnap); 
			setDoc(docRef, {name: row.name, quantity: updatedQuantity });
		} 
		else if (action === 'remove') {
		 	const docRef = doc(collection(firestore, 'inventory'), row.id)
			const docSnap = await getDoc(docRef)	
			console.log("Doc Snap: ", docSnap); 
			deleteDoc(docRef);
		}
		await updateInventory(); 
	};



	return( 
		   
		   <Container 

		    maxWidth= {false}
			sx={{ bgcolor: 'tomato', 
				  height: '100vh',
				  width: '80%',
				  padding: '1vw'
			}}
		   >
			   <Box
				   width="100%"
				   height="100vh"
				   display={'flex'}
				   justifyContent={'top'}
				   flexDirection={'column'}
				   alignItems={'center'}
				   gap={2}
				   sx = {{ borderStyle: 'solid',borderWidth: '2px', borderColor: 'white'}}
			   >

				   <div className={styles.headingTitle}> 
				   		<p> Inventory Management </p> 
				   </div>  


				   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2, minWidth: 650 }}>
				   <TextField

				   label="Search"
				   variant="outlined"
				   value={searchTerm}
				   onChange={handleSearchChange}
				   sx={{ flex: 1 }} // Make the TextField take up available space
				   />


				   <Button variant="contained" 
				   sx={{ 
					   backgroundColor: 'tomato', 
					   width: '100px', 
					   fontSize: '0.8rem', 
					   padding: '10px 20px', 	
					   border: '2px solid white',
					   borderRadius: '8px',       
					   backgroundColor: 'tomato'
				   }}
				   onClick={handleAddItemClick}>Add Item
				   </Button>


				   <Button variant="outlined" 
				   sx={{ 
					   backgroundColor: 'tomato', 
					   width: '100px', 
					   fontSize: '0.8rem', 
					   color: 'white',
					   padding: '10px 20px', 	
					   border: '2px solid white',
					   borderRadius: '8px',       
					   backgroundColor: 'tomato'
				   }}
				   onClick={handleClear}>Clear
				   </Button>

				   </Box>

				   {showItemForm && ( 
					   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					   <TextField
					   label="Item Name"
					   variant="outlined"
					   value={name}
					   onChange={(e) => setName(e.target.value)}
					   sx={{ flex: 1 }}
					   />
					   <TextField
					   label="Quantity"
					   variant="outlined"
					   type="number"
					   value={quantity}
					   onChange={(e) => setQuantity(e.target.value)}
					   sx={{ flex: 1 }}
					   />
					   <Button variant="contained" 
						   sx={{ 
							   backgroundColor: 'tomato', 
							   width: '100px', 
							   fontSize: '0.8rem', 
							   color: 'white',
							   padding: '10px 20px', 	
							   border: '2px solid white',
							   borderRadius: '8px',       
							   backgroundColor: 'tomato'
						   }}
						   onClick={handleSubmit}>Submit</Button>
					   </Box>
				   )}


				   <TableContainer component={Paper}  sx={{ maxWidth: 800 }}  >
					   <Table 
						sx={{ minWidth: 650,
							border: '2px solid white',
							borderRadius: '8px',       
							backgroundColor: 'tomato', 
						}} 
					   	>
						   <TableHead>
							   <TableRow   sx={{ margin: 2 }} >
								   <TableCell sx={{ color: '#ffffff', fontSize: '1.3rem' }}>Item Name </TableCell>
								   <TableCell sx={{ color: '#ffffff', fontSize: '1.3rem' }} align="right">Timestamp</TableCell>
								   <TableCell sx={{ color: '#ffffff', fontSize: '1.3rem' }} align="right">Quantity</TableCell>
								   <TableCell sx={{ color: '#ffffff', fontSize: '1.3rem' }} align="right"></TableCell>
								   <TableCell sx={{ color: '#ffffff', fontSize: '1.3rem' }} align="right"></TableCell>
								   <TableCell sx={{ color: '#ffffff', fontSize: '1.3rem' }} align="right"></TableCell>
							   </TableRow>
						   </TableHead>
						   <TableBody>


						   {filteredInventory.map((row) => (
							   <TableRow
							   key={row.name}
							   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							   >
							   <TableCell component="th" scope="row"  sx={{ color: '#ffffff', fontSize: '1rem'}} >
							   {row.name}
							   </TableCell>
							   <TableCell align="right"  sx={{ color: '#ffffff', fontSize: '1rem'}} >{row.id}</TableCell>
							   <TableCell align="right"  sx={{ color: '#ffffff', fontSize: '1rem'}}  >{row.quantity}</TableCell>


							   <TableCell align="right" sx={{ width: '40px' }}>
							   <Button
							   variant="contained"
							   sx={{ 
								   backgroundColor: 'tomato', 
								   width: '50px', 
								   fontSize: '0.65rem', 
								   padding: '5px 10px',
								   border: '2px solid white',
								   borderRadius: '8px',       
								   backgroundColor: 'tomato'  
							   }}
							   onClick={() => handleButtonClick('increase', row)}
							   >
							   Increase
							   </Button>
							   </TableCell>
							   <TableCell align="right" sx={{ width: '40px' }}>
							   <Button
							   variant="contained"
							   sx={{ 
								   backgroundColor: 'tomato', 
								   width: '50px', 
								   fontSize: '0.65rem', 
								   padding: '5px 10px',
								   border: '2px solid white',
								   borderRadius: '8px',       
								   backgroundColor: 'tomato'  
							   }}
							   onClick={() => handleButtonClick('decrease', row)}
							   >
							   Decrease
							   </Button>
							   </TableCell>
							   <TableCell align="right" sx={{ width: '40px' }}>
							   <Button
							   variant="contained"
							   sx={{ 
								   backgroundColor: 'tomato', 
								   width: '50px', 
								   fontSize: '0.65rem', 
								   padding: '5px 10px', 	
								   border: '2px solid white',
								   borderRadius: '8px',       
								   backgroundColor: 'tomato'
							   }}
							   onClick={() => handleButtonClick('remove', row)}
							   >
							   Remove
							   </Button>
							   </TableCell>

							   </TableRow>

						   ))}
						   </TableBody>
					   </Table>
				   </TableContainer>



			   </Box> 
		   </Container> 
		  )
}
