import React, {useState} from 'react';
import {useStyletron} from 'baseui';
import {Switch, Route, Redirect} from 'react-router';
import {Link} from 'fusion-plugin-react-router';
import {assetUrl} from 'fusion-core';
import {DashboardPage} from './dashboard';
import {VendorsPage} from './vendors';
import {BudgetPage} from './budget';
import {TimelinePage} from './timeline';
import {ChecklistPage} from './checklist';
import {SettingsPage} from './settings';
import {RoutePaths} from '../../constants';
import {EventContextProvider} from '../event/context';
import {NewVendorPage} from './new-vendor';
import {EditingVendorContextProvider} from '../contexts/vendors';
import {VendorPage} from './vendor/vendor';
import {Show} from 'baseui/icon';
import {FileViewer} from '../file-viewer';

export const EventPage = ({
  match: {
    params: {eventId},
  },
}) => {
  const [css, theme] = useStyletron();
  const containerStyles = css({
    display: 'flex',
    height: '100%',
  });
  const sidebarStyles = css({
    flex: `0 0 ${theme.sizing.scale1600}`,
    backgroundColor: '#FFFFFF',
    boxShadow: '1px 0 4px 0 #F3F2F2',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  });
  const menuContainerStyles = css({
    height: '350px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  });
  const mainStyles = css({
    flexGrow: 1,
    paddingTop: '50px',
    paddingLeft: theme.sizing.scale1600,
    paddingRight: theme.sizing.scale1600,
    overflow: 'auto',
  });
  const fileSidebarStyles = css({
    flex: '0 0 50px',
    backgroundColor: '#FFFFFF',
    boxShadow: '1px 0 4px 0 #F3F2F2',
    borderTopLeftRadius: '20px',
    borderBottomLeftRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  });
  const openedFileSidebarStyles = css({
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    boxShadow: '1px 0 4px 0 #F3F2F2',
    borderTopLeftRadius: '20px',
    borderBottomLeftRadius: '20px',
    minWidth: '450px',
  });
  const fileSidebarTextStyles = css({
    transform: 'rotate(180deg)',
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    ...theme.typography.font200,
    cursor: 'pointer',
    color: '#757575',
    ':hover': {
      color: theme.colors.primary,
    },
  });
  const mainBodyStyles = css({
    minWidth: '800px',
    maxWidth: '1400px',
    marginLeft: 'auto',
    marginRight: 'auto',
  });
  const selectedStyles = {
    backgroundColor: '#F1EAD9',
    opacity: 0.7,
  };
  const baseIconContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.sizing.scale900,
    height: theme.sizing.scale900,
  };

  const renderImage = (icon, isSelected) => (
    <div
      className={css(
        isSelected
          ? {...baseIconContainerStyles, ...selectedStyles}
          : baseIconContainerStyles
      )}
    >
      <img
        src={icon}
        className={isSelected ? css({color: '#F1EAD9'}) : undefined}
      />
    </div>
  );

  // TODO use the selectedIcon when we update it to be same width/height
  const menuItems = [
    {
      icon: assetUrl('../../static/dashboard.svg'),
      selectedIcon: assetUrl('../../static/dashboard-selected.svg'),
      route: RoutePaths.EventDashboard(eventId),
    },
    {
      icon: assetUrl('../../static/vendors.svg'),
      selectedIcon: assetUrl('../../static/vendors-selected.svg'),
      route: RoutePaths.EventVendors(eventId),
      subRoutes: [RoutePaths.EventVendor(eventId)],
    },
    {
      icon: assetUrl('../../static/budget.svg'),
      selectedIcon: assetUrl('../../static/budget-selected.svg'),
      route: RoutePaths.EventBudget(eventId),
    },
    {
      icon: assetUrl('../../static/timeline.svg'),
      selectedIcon: assetUrl('../../static/timeline-selected.svg'),
      route: RoutePaths.EventTimeline(eventId),
    },
    {
      icon: assetUrl('../../static/checklist.svg'),
      selectedIcon: assetUrl('../../static/checklist-selected.svg'),
      route: RoutePaths.EventChecklist(eventId),
    },
    {
      icon: assetUrl('../../static/settings.svg'),
      selectedIcon: assetUrl('../../static/settings-selected.svg'),
      route: RoutePaths.EventSettings(eventId),
    },
  ].map(({icon, route, subRoutes}) => (
    <div key={route}>
      <Link to={route}>
        <Switch>
          <Route exact path={route} render={() => renderImage(icon, true)} />
          {(subRoutes || []).map(r => (
            <Route key={r} path={r} render={() => renderImage(icon, true)} />
          ))}
          <Route render={() => renderImage(icon, false)} />
        </Switch>
      </Link>
    </div>
  ));

  const [fileOpen, setFileOpen] = useState(false);
  return (
    <EventContextProvider eventId={eventId}>
      <EditingVendorContextProvider>
        <Switch>
          <Route
            exact
            path={RoutePaths.NewVendor()}
            component={NewVendorPage}
          />
          <Route
            exact
            path={RoutePaths.EditVendor()}
            component={NewVendorPage}
          />
          <Route
            render={() => (
              <div className={containerStyles}>
                <div className={sidebarStyles}>
                  <div className={menuContainerStyles}>{menuItems}</div>
                </div>
                <div className={mainStyles}>
                  <div className={mainBodyStyles}>
                    <Switch>
                      <Route
                        exact
                        path={RoutePaths.EventDashboard()}
                        component={DashboardPage}
                      />
                      <Route
                        exact
                        path={RoutePaths.EventVendors()}
                        component={VendorsPage}
                      />
                      <Route
                        path={RoutePaths.EventVendor()}
                        component={VendorPage}
                      />
                      <Route
                        exact
                        path={RoutePaths.EventBudget()}
                        component={BudgetPage}
                      />
                      <Route
                        exact
                        path={RoutePaths.EventTimeline()}
                        component={TimelinePage}
                      />
                      <Route
                        exact
                        path={RoutePaths.EventChecklist()}
                        component={ChecklistPage}
                      />
                      <Route
                        exact
                        path={RoutePaths.EventSettings()}
                        component={SettingsPage}
                      />
                      <Route
                        render={() => (
                          <Redirect to={RoutePaths.EventDashboard(eventId)} />
                        )}
                      />
                    </Switch>
                  </div>
                </div>
                <Switch>
                  <Route
                    path={RoutePaths.EventVendor()}
                    render={() => {
                      if (fileOpen) {
                        return (
                          <div className={openedFileSidebarStyles}>
                            <FileViewer onClose={() => setFileOpen(false)} />
                          </div>
                        );
                      }

                      return (
                        <div className={fileSidebarStyles}>
                          <div
                            className={css({
                              display: 'flex',
                              justifyContent: 'center',
                            })}
                          >
                            <div
                              className={fileSidebarTextStyles}
                              onClick={() => setFileOpen(true)}
                            >
                              VIEW DOCUMENT
                              <Show
                                size={24}
                                overrides={{
                                  Svg: {
                                    style: {
                                      transform: 'rotate(90deg)',
                                      marginTop: '10px',
                                    },
                                  },
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                </Switch>
              </div>
            )}
          ></Route>
        </Switch>
      </EditingVendorContextProvider>
    </EventContextProvider>
  );
};
