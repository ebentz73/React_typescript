import React, {useContext, useMemo} from 'react';
import {useFrostedStyletron} from '../../util';
import {Button, KIND, SIZE} from 'baseui/button';
import {VendorContextProvider, VendorContext} from '../../contexts/vendor';
import {useRouteMatch, useHistory, Switch, Route, Redirect} from 'react-router';
import {RoutePaths} from '../../../constants';
import {unwrap} from '../../../util';
import {ChevronLeft} from 'baseui/icon';
import {EventContext} from '../../event/context';
import {ContactPage} from './contact';
import {BudgetPage} from '../budget';
import {PaymentPage} from './payment';
import {TimelinePage} from '../timeline';
import {NotesPage} from './notes';

export const VendorPage = () => {
  const match = useRouteMatch<{vendorId: string}>(RoutePaths.EventVendor());
  const {vendorId} = unwrap(match).params;

  return (
    <VendorContextProvider vendorId={vendorId}>
      <VendorPageInternal />
    </VendorContextProvider>
  );
};

const VendorPageInternal = () => {
  const [css, theme] = useFrostedStyletron();
  const history = useHistory();
  const {event} = useContext(EventContext);
  const {
    state: {vendor},
  } = useContext(VendorContext);

  const subPages = useMemo(
    () => [
      {
        title: 'CONTACT',
        route: RoutePaths.VendorContact(event.id, vendor.id),
        matcher: RoutePaths.VendorContact(),
        page: () => <ContactPage />,
      },
      {
        title: 'BUDGET ITEMS',
        route: RoutePaths.VendorBudgetItems(event.id, vendor.id),
        matcher: RoutePaths.VendorBudgetItems(),
        page: () => <BudgetPage />,
      },
      {
        title: 'PAYMENT SCHEDULE',
        route: RoutePaths.VendorPaymentSchedule(event.id, vendor.id),
        matcher: RoutePaths.VendorPaymentSchedule(),
        page: () => <PaymentPage />,
      },
      {
        title: 'TIMELINE ITEMS',
        route: RoutePaths.VendorTimelineItems(event.id, vendor.id),
        matcher: RoutePaths.VendorTimelineItems(),
        page: () => <TimelinePage />,
      },
      {
        title: 'NOTES',
        route: RoutePaths.VendorNotes(event.id, vendor.id),
        matcher: RoutePaths.VendorNotes(),
        page: () => <NotesPage />,
      },
    ],
    [event.id, vendor.id]
  );

  const commonAnchorStles = {
    ...theme.typography.font100,
    marginLeft: '28px',
    verticalAlign: 'middle',
    cursor: 'pointer',
    color: '#0B0C0E',
  };
  const filterAnchorStyles = css(commonAnchorStles);
  const selectedFilterAnchorStyles = css({
    ...commonAnchorStles,
    borderBottom: `2px solid ${theme.colors.primary}`,
  });

  const isTopLevelPage = useRouteMatch(RoutePaths.EventVendor());

  return (
    <>
      {isTopLevelPage && isTopLevelPage.isExact && (
        <Redirect to={RoutePaths.VendorContact(event.id, vendor.id)} />
      )}
      <div>
        <div
          className={css({
            ...theme.titleFont,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          })}
        >
          <div className={css({display: 'flex'})}>
            <div
              className={css({cursor: 'pointer', marginRight: '14px'})}
              onClick={() => history.push(RoutePaths.EventVendors(event.id))}
            >
              <ChevronLeft size={32} />
            </div>
            {vendor.name}
          </div>
          <div>
            <Button kind={KIND.primary} size={SIZE.compact}>
              +
            </Button>
          </div>
        </div>
        <div className={css({marginTop: '16px'})}>
          {subPages.map(page => {
            const renderItem = isActive => (
              <span
                key={page.title}
                className={
                  isActive ? selectedFilterAnchorStyles : filterAnchorStyles
                }
                onClick={() => history.push(page.route)}
              >
                <a>{page.title}</a>
              </span>
            );

            return (
              <Switch key={page.title}>
                <Route
                  exact
                  path={page.matcher}
                  render={() => renderItem(true)}
                />
                <Route render={() => renderItem(false)} />
              </Switch>
            );
          })}
        </div>
        <div className={css({marginTop: '24px'})}>
          {subPages.map(page => {
            return (
              <Switch key={page.title}>
                <Route exact path={page.matcher} render={() => page.page()} />
                <Route render={() => null} />
              </Switch>
            );
          })}
        </div>
      </div>
    </>
  );
};
