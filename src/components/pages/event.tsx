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
      route: `/event/${eventId}/dashboard`,
    },
    {
      icon: assetUrl('../../static/vendors.svg'),
      selectedIcon: assetUrl('../../static/vendors-selected.svg'),
      route: `/event/${eventId}/vendors`,
    },
    {
      icon: assetUrl('../../static/budget.svg'),
      selectedIcon: assetUrl('../../static/budget-selected.svg'),
      route: `/event/${eventId}/budget`,
    },
    {
      icon: assetUrl('../../static/timeline.svg'),
      selectedIcon: assetUrl('../../static/timeline-selected.svg'),
      route: `/event/${eventId}/timeline`,
    },
    {
      icon: assetUrl('../../static/checklist.svg'),
      selectedIcon: assetUrl('../../static/checklist-selected.svg'),
      route: `/event/${eventId}/checklist`,
    },
    {
      icon: assetUrl('../../static/settings.svg'),
      selectedIcon: assetUrl('../../static/settings-selected.svg'),
      route: `/event/${eventId}/settings`,
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
            path="/event/:eventId/dashboard"
            component={DashboardPage}
          />
          <Route exact path="/event/:eventId/vendors" component={VendorsPage} />
          <Route exact path="/event/:eventId/budget" component={BudgetPage} />
          <Route
            exact
            path="/event/:eventId/timeline"
            component={TimelinePage}
          />
          <Route
            exact
            path="/event/:eventId/checklist"
            component={ChecklistPage}
          />
          <Route
            exact
            path="/event/:eventId/settings"
            component={SettingsPage}
          />
          <Route
            render={() => <Redirect to={`/event/${eventId}/dashboard`} />}
          />
        </Switch>
      </div>
    </div>
  );
};
