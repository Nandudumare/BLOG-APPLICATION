import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { FormControlLabel } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultiSelectSubCat({
  getSubCat,
  name,
  subcat,
  onChange,
}) {
  const [personName, setPersonName] = React.useState([]);
  // console.log("personName:", personName);

  const [state, setState] = React.useState(true);
  const [names, setNames] = React.useState([]);
  const [checked, setChecked] = React.useState(false);

  //   React.useEffect(() => {
  //     let data;

  //     const getData = async () => {
  //       try {
  //         const res = await axios.get("http://localhost:8080/category");
  //         data = res.data;
  //         setNames(data.map((el) => el.name));
  //         setState(false);
  //       } catch (err) {}
  //     };

  //     getData();
  //   }, []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  React.useEffect(() => {
    getSubCat(personName);
  }, [personName]);

  return (
    <div style={{ textAlign: "left" }}>
      <FormControl sx={{ m: 0, width: 300 }}>
        {/* <FormControlLabel
          control={<Checkbox checked={checked} />}
          label={name}
        /> */}
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          displayEmpty
          value={personName}
          onFocus={() => setChecked((prev) => !prev)}
          onChange={(e) => {
            handleChange(e);
            onChange();
          }}
          input={
            <OutlinedInput
              label="Tag"
              style={{ color: "black", border: "1px solid whitesmoke" }}
            />
          }
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em style={{ color: "black" }}>{name}</em>;
            }
            return selected.join(", ");
          }}
          MenuProps={MenuProps}
        >
          <MenuItem disabled value="">
            <em>{name}</em>
          </MenuItem>
          {subcat.map((el) => (
            <MenuItem key={el.name} value={el.name}>
              <Checkbox checked={personName.indexOf(el.name) > -1} />
              <ListItemText primary={el.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
