import React, { Suspense } from 'react'
import { Route,Navigate } from 'react-router-dom';
import ErrorBoundary from '../ErrorBoundry';
import ScreenLoader from '../CommonComponents/ScreenLoader';

const privateRoute = ({element:Component,isAuthenticated,errorBoundry,lazyLoading=false,...rest}) =>(
    <Route
        {...rest}
        render={(props)=>{
            if(!lazyLoading){
                return isAuthenticated?errorBoundry?
                (
                    <ErrorBoundary>
                        <Component {...props} {...rest}/>
                    </ErrorBoundary>
                ): ( 
                    <Component {...props}/>
                    ):(
                        <Navigate to={{pathname:'/' , state:{from:props.location}}}/>
                    )
            }
            else {
                return isAuthenticated ?errorBoundry?
                (
                    <ErrorBoundary>
                        <Suspense fallback={<ScreenLoader open={true}/>}>
                            <Component {...props} {...rest}/>
                        </Suspense>
                    </ErrorBoundary>
                ):
                (
                    <Suspense fallback={<ScreenLoader open={true}/>}>
                        <Component {...props} />
                    </Suspense>
                ):
                (
                    <Navigate to={{pathname:'/' ,state:{from:props.location}}}/>
                )
            }
        }}/>
  
)

export default privateRoute;