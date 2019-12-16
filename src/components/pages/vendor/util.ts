import {FrostedTheme} from '../../util';

export const getAddRowStyles = (theme: FrostedTheme) => ({
  border: `1px dashed ${theme.colors.primary200}`,
  borderRadius: '4px',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.colors.primary200,
  fontSize: '12px',
  cursor: 'pointer',
});
