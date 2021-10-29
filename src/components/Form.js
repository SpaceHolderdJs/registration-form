import React, { useReducer, useState, useCallback, useEffect } from "react";
import {
  Button,
  MenuItem,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";

const reducer = (store, action) => {
  switch (action.type) {
    case "INIT_FIRSTNAME":
      return { ...store, firstName: action.payload };
    case "INIT_LASTNAME":
      return { ...store, lastName: action.payload };
    case "INIT_DATEOFBIRTH":
      return { ...store, dateOfBirth: action.payload };
    case "INIT_EMAIL":
      return { ...store, email: action.payload };
    case "INIT_FRAMEWORK":
      return { ...store, framework: action.payload };
    case "INIT_VERSION":
      return { ...store, version: action.payload };
    case "ADD_HOBBY":
      return { ...store, hobbies: [...store.hobbies, action.payload] };
    case "DELETE_HOBBY":
      return {
        ...store,
        hobbies: store.hobbies.filter(
          (hobby) => hobby.name !== action.payload.name
        ),
      };
    default:
      return store;
  }
};

const Form = () => {
  const frameworks = ["angular", "react", "vue"];
  const versions = {
    angular: ["1.1.1", "1.2.1", "1.3.3"],
    react: ["2.1.1", "2.2.1", "2.3.3"],
    vue: ["3.1.1", "3.2.1", "3.3.3"],
  };

  const [store, dispatch] = useReducer(reducer, { hobbies: [] });

  const [hobby, setHobby] = useState({});
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState();
  const [finish, setFinish] = useState(false);

  const addHobby = useCallback(() => {
    dispatch({ type: "ADD_HOBBY", payload: hobby });
    setHobby({ name: "", duration: "" });
  }, [hobby]);

  const deleteHobby = useCallback(
    (hobby) => {
      dispatch({ type: "DELETE_HOBBY", payload: hobby });
    },
    [hobby]
  );

  const validator = useCallback(async (store, delay) => {
    const notAllowed = ["test@test.test"];
    //server imitation
    return new Promise((res, rej) => {
      setLoading(true);
      setTimeout(() => {
        notAllowed.includes(store.email) ? rej() : res();
      }, delay);
    }).then(
      (success) => {
        setLoading(false);
        setFinish(true);
      },
      (error) => {
        setLoading(false);
        setEmailError("Email is already exists");
      }
    );
  }, []);

  useEffect(() => {
    if (!store.email) return;
    else
      store.email?.length > 3 &&
      store.email.includes("@") &&
      store.email.includes(".")
        ? setEmailError(null)
        : setEmailError("Email is not valid");
  }, [store.email]);

  return (
    <div className="form column centered">
      <TextField
        type="text"
        label="Name"
        variant="outlined"
        margin="dense"
        fullWidth={true}
        value={store.firstName}
        onChange={(e) =>
          dispatch({ type: "INIT_FIRSTNAME", payload: e.target.value })
        }
      />
      <TextField
        type="text"
        label="Surname"
        variant="outlined"
        margin="dense"
        fullWidth={true}
        value={store.lastName}
        onChange={(e) =>
          dispatch({ type: "INIT_LASTTNAME", payload: e.target.value })
        }
      />

      <TextField
        type="date"
        fullWidth={true}
        margin="dense"
        defaultValue={Date.now()}
        value={store.dateOfBirth}
        onChange={(e) =>
          dispatch({ type: "INIT_DATEOFBIRTH", payload: e.target.value })
        }
      />
      <TextField
        select
        label="framework"
        fullWidth={true}
        margin="dense"
        value={store.framework}
        onChange={(e) =>
          dispatch({ type: "INIT_FRAMEWORK", payload: e.target.value })
        }>
        {frameworks.map((framework) => (
          <MenuItem value={framework} key={framework}>
            {framework}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="version"
        fullWidth={true}
        margin="dense"
        disabled={!store.framework}
        value={store.version}
        onChange={(e) =>
          dispatch({ type: "INIT_VERSION", payload: e.target.value })
        }>
        {store.framework &&
          versions[store.framework].map((version) => (
            <MenuItem value={version} key={version}>
              {version}
            </MenuItem>
          ))}
      </TextField>
      <TextField
        error={emailError}
        type="email"
        label="email"
        variant="outlined"
        margin="dense"
        fullWidth={true}
        value={store.email}
        onChange={(e) =>
          dispatch({ type: "INIT_EMAIL", payload: e.target.value })
        }
      />
      {emailError && <Alert severity="error">{emailError}</Alert>}
      <h3>Hobbies</h3>
      {store.hobbies.length > 0 &&
        store.hobbies.map((hobby) => (
          <div className="row centered sp-btw hobby-fields-wrapper" key={hobby}>
            <TextField
              type="text"
              defaultValue={hobby.name}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              onChange={(e) => setHobby({ ...hobby, name: e.target.value })}
            />
            <TextField
              type="text"
              defaultValue={hobby.duration}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              onChange={(e) => setHobby({ ...hobby, duration: e.target.value })}
            />
            <Button onClick={() => deleteHobby(hobby)} className="btn">
              Delete
            </Button>
          </div>
        ))}
      <div className="row centered sp-btw hobby-fields-wrapper">
        <TextField
          label="Name of hobby"
          variant="outlined"
          margin="dense"
          value={hobby.name}
          onChange={(e) => setHobby({ ...hobby, name: e.target.value })}
        />
        <TextField
          label="How long"
          variant="outlined"
          margin="dense"
          value={hobby.duration}
          onChange={(e) => setHobby({ ...hobby, duration: e.target.value })}
        />
        <Button
          disabled={!hobby.name || !hobby.duration}
          onClick={() => addHobby()}
          className="btn">
          Add one
        </Button>
      </div>
      {loading ? (
        <CircularProgress />
      ) : (
        <Button
          disabled={
            Object.values(store).some((val) => val.length === 0) && !emailError
          }
          color="success"
          variant="outlined"
          onClick={() => validator(store, 2000)}>
          Sign up
        </Button>
      )}
      {finish && <Alert severity="success">User registered :)</Alert>}
    </div>
  );
};

export default Form;
