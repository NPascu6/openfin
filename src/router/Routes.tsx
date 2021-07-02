import React from "react";
import {Route, Switch} from "react-router-dom";
import ForbiddenPage from "../pages/errors/403";
import NotFoundPage from "../pages/errors/404";
import MainWindow from "../pages/main-window/MainWindow";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ChildWindow from "../pages/child-window/ChildWindow";

export interface RouteDefinition {
    path: string;
    name?: string,
    page?: any;
    icon?: any;
    open?: boolean;
    roles?: string[];
    children?: RouteDefinition[],
    accounts?: string[];
}

export const rootRouteDefinition: RouteDefinition =
    {
        path: "",
        children: [
            {
                path: "/",
                name: "Main Window",
                page: MainWindow,
                icon: DashboardIcon,
            },
            {
                path: '/child-window',
                name: "Chanel Window Client",
                page: ChildWindow,
                icon: DashboardIcon,
            }
        ]
    }

const flatten = (route: RouteDefinition): RouteDefinition[] => {
    let routes: any[] = [];
    if (route.page) {
        routes = routes.concat(route);
    }

    if (route.children && route.children.length > 0) {
        routes = routes.concat(...route.children.map(r => {
            return flatten(r);
        }));
    }

    return routes;
};

const flattenRoutes = flatten(rootRouteDefinition);

export const RoutesSwitch = () => {
    return (
        <Switch>
            <Switch>
                {flattenRoutes.map((route: any, index: number) =>
                    (
                        <Route key={`${route}-${index}`} exact={true} path={route.path} render={props =>
                            <route.page {...props} />
                        }/>
                    )
                )}
            </Switch>
            <Route path="/403" component={ForbiddenPage}/>
            <Route path="/404" component={NotFoundPage}/>
            <Route path="*" component={NotFoundPage}/>
        </Switch>
    );
};

