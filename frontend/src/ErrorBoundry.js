import React from "react";
import Grid from "@material-ui/core/Grid";
export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log(error)
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <Grid container style={{
                    //background: "#E8E8E8",
                    position: "absolute",
                    top: "40%",
                    left: "63px",
                    width: "calc(100% - 63px)"
                }}>
                    <Grid
                        item
                        md={12}
                        sm={12}
                        xs={12}
                        style={{ paddingLeft: '40%' }}
                    >
                        There was an error in page,
                        something went wrong.
                </Grid>
                </Grid >
            )
        }

        return this.props.children;
    }
}