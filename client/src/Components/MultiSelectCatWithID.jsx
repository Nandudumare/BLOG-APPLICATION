// import * as React from "react";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import ListItemText from "@mui/material/ListItemText";
// import Select, { SelectChangeEvent } from "@mui/material/Select";
// import Checkbox from "@mui/material/Checkbox";
// import axios from "axios";
// import CircularProgress from "@mui/material/CircularProgress";

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

// export default function MultiSelectCatWithID({ getCat }) {
//   const [personName, setPersonName] = React.useState([]);
//   //   console.log('personName:', personName)
//   const [state, setState] = React.useState(true);
//   const [names, setNames] = React.useState([]);
//   const [category, setCategory] = React.useState([]);
//   const [idData, setIdData] = React.useState([]);

//   React.useEffect(() => {
//     let data;
//     const getData = async () => {
//       try {
//         const res = await axios.get("http://localhost:8080/category");
//         data = res.data;
//         setCategory([...data]);
//         setNames(data.map((el) => el.name));
//         setState(false);
//       } catch (err) {}
//     }
//     getData();
//   }, []);

//   const handleChange = (event) => {
//     const {
//       target: { value },
//     } = event;
//     setPersonName(
//       // On autofill we get a stringified value.
//       typeof value === "string" ? value.split(",") : value
//     );
//   };

//   // getCat(personName);

//   React.useEffect(() => {
//     // let arr = [];
//     // for (let i = 0; i < personName.length; i++) {
//     //   for (let j = 0; j < category.length; j++) {
//     //     if (personName[i] === category[j].name) {
//     //       setIdData([...idData, category[j]._id]);
//     //       //   arr.push();
//     //     }
//     //   }
//     //   }
//     // const getIdData = async () => {
//     //   const payload = {
//     //     categoryDataString: personName,
//     //   };
//     //   const res = await axios.post(
//     //     "http://localhost:8080/category/arrayid",
//     //     payload
//     //   );
//     //   getCat(res.data);
//     // };
//     // getIdData();
//     // console.log("personName:", personName);
//   }, [personName]);

//   return state ? (
//     <div style={{ textAlign: "left" }}>
//       <CircularProgress />
//     </div>
//   ) : (
//     <div style={{ textAlign: "left" }}>
//       <FormControl sx={{ m: 0, width: 300 }}>
//         <InputLabel
//           id="demo-multiple-checkbox-label"
//           style={{
//             padding: "0 0.25rem",
//             background: "#001e3c",
//             color: "white",
//           }}
//         >
//           category
//         </InputLabel>
//         <Select
//           labelId="demo-multiple-checkbox-label"
//           id="demo-multiple-checkbox"
//           multiple
//           value={personName}
//           onChange={handleChange}
//           input={
//             <OutlinedInput
//               label="Tag"
//               style={{ color: "white", border: "1px solid whitesmoke" }}
//             />
//           }
//           renderValue={(selected) => selected.join(", ")}
//           MenuProps={MenuProps}
//         >
//           {names.map((name) => (
//             <MenuItem key={name} value={name}>
//               <Checkbox checked={personName.indexOf(name) > -1} />
//               <ListItemText primary={name} />
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </div>
//   );
// }
