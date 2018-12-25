import Responsive from 'react-responsive';

export const DesktopOrTablet = props => (
  <Responsive {...props} minWidth={769} />
);
export const Mobile = props => <Responsive {...props} maxWidth={767} />;
export const Default = props => <Responsive {...props} minWidth={768} />;
