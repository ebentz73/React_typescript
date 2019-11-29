import {styled} from 'baseui';
import {Link} from 'fusion-plugin-react-router';

export const StyledRouterLink = styled(Link, {
  color: 'unset',
  textDecoration: 'unset',
  ':hover': {
    textDecoration: 'underline',
  },
});
