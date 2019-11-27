import * as React from 'react';
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
    width: theme.sizing.scale1600,
    backgroundColor: '#FFFFFF',
    boxShadow: '1px 0 4px 0 #F3F2F2',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  });
  const menuContainerStyles = css({
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  });
  const mainStyles = css({
    flexGrow: 1,
    marginTop: '50px',
    marginLeft: theme.sizing.scale1600,
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
      <img src={icon} className={isSelected ? css({color: '#F1EAD9'}) : null} />
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
  ].map(({icon, route}) => (
    <div key={route}>
      <Link to={route}>
        <Switch>
          <Route exact path={route} render={() => renderImage(icon, true)} />
          <Route render={() => renderImage(icon, false)} />
        </Switch>
      </Link>
    </div>
  ));

  return (
    <div className={containerStyles}>
      <div className={sidebarStyles}>
        <div className={menuContainerStyles}>{menuItems}</div>
      </div>
      <div className={mainStyles}>
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
          <Route exact path={RoutePaths.EventBudget()} component={BudgetPage} />
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
            render={() => <Redirect to={RoutePaths.EventDashboard(eventId)} />}
          />
        </Switch>
      </div>
    </div>
  );
};
