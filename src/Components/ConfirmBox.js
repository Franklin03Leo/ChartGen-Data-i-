import {
  Dialog,
  Fade,
  DialogContent,
  IconButton,
  Grid,
  Box,
  Typography,
  Button,
} from "@mui/material";
import React, { forwardRef } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

function ConfirmBox({ open, closeDialog, deleteFunction, message }) {
  return (
    <div>
      <Dialog
        fullWidth
        open={open}
        minWidth="md"
        scroll="body"
        onClose={closeDialog}
        onBackdropClick={closeDialog}
        TransitionComponent={Transition}
      >
        <DialogContent sx={{ px: 6, py: 5,position: "relative" }}>
          <IconButton
            size="medium"
            onClick={closeDialog}
            sx={{ position: "absolute", right: "1rem", top: "1rem" }}
          >
            X
          </IconButton>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                }}
              >
                {/* <Typography variant="h5">Delete {title}</Typography> */}
                <div className="fs-5">
                  {/* Are you sure you want to delete? */}
                  {message}
                  
                </div>
              </Box>
            </Grid>
          </Grid>

          <Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
            >
              <button
                onClick={closeDialog}
                className="btn btn-primary btn-lg w-25"
              >
                Cancel
              </button>
              <button
                onClick={deleteFunction}
              className="btn btn-secondary btn-lg w-25"
                // style={{
                //   borderRadius: "5px",
                //   outline: "none",
                //   backgroundColor: "#2c2c2c",
                //   color: "#fff",
                //   border: "none",
                //   width: "80px",
                //   height: "2.5rem",
                // }}
              >
                Delete
              </button>{" "}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default ConfirmBox;
