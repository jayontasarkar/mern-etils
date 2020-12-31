import { Switch, Route } from 'react-router-dom';
import SigninPage from './pages/auth/signin';
import SignupPage from './pages/auth/signup';
import JoinTeamPage from './pages/teams/joinTeam';
import JoinTeamViaLinkPage from './pages/teams/joinTeamViaLink';
import Dashboard from './pages/dashboard';
import HomePage from './pages/home';
import ProfileSettingsPage from './pages/teams/profileSettings';
import MemberSettingsPage from './pages/teams/memberSettings';
import InvitationSettingsPage from './pages/teams/invitationSettings';
import TeamSetupPage from './pages/teams/teamSetup';
import MyDocsPage from './pages/docs/myDocs';
import PreviewDocPage from './pages/docs/preview';
import EditDocPage from './pages/docs/editDoc';
import SharedDocsPage from './pages/docs/sharedDocs';
import NewDocPage from './pages/docs/newDoc';
import ProtectedRoute from './components/routes/protectedRoute';

function App() {
  return (
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/auth/signup" component={SignupPage} />
      <Route path="/auth/signin" component={SigninPage} />
      <Route path="/docs/preview/:id" component={PreviewDocPage} />

      <Route
        path="/organization/:team/join-link/:token"
        component={JoinTeamViaLinkPage}
      />
      <Route
        path="/organization/:teamId/join/:invitationId"
        component={JoinTeamPage}
      />

      <ProtectedRoute path="/dashboard" component={Dashboard} />

      <ProtectedRoute path="/app/new-note" component={NewDocPage} />
      <ProtectedRoute path="/app/notes" exact component={MyDocsPage} />
      <ProtectedRoute path="/app/notes/:doc/edit" component={EditDocPage} />
      <ProtectedRoute path="/app/shared-notes" component={SharedDocsPage} />

      <ProtectedRoute path="/teams/setup" component={TeamSetupPage} />
      <ProtectedRoute
        path="/settings/organization/profile"
        component={ProfileSettingsPage}
      />
      <ProtectedRoute
        path="/settings/organization/users"
        component={MemberSettingsPage}
      />
      <ProtectedRoute
        path="/settings/organization/invitations"
        component={InvitationSettingsPage}
      />
    </Switch>
  );
}

export default App;
