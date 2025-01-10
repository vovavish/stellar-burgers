import { useEffect } from 'react';

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';

import { useDispatch, useSelector } from '../../services/store';
import {
  checkUserAuth,
  getIngredientsThunk,
  getIsModalOpen,
  toggleModal
} from '../../features';

const App = () => {
  const isModalOpen = useSelector(getIsModalOpen);
  const dispatch = useDispatch();

  const location = useLocation();
  const locationStateBackground = location.state?.background;

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(getIngredientsThunk());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={locationStateBackground || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route path='/feed/:id' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        <Route path='/' element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        <Route path='/' element={<ProtectedRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
          <Route
            path='/profile/orders/:id'
            element={
              <Modal
                title=''
                onClose={() => {
                  dispatch(toggleModal());
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {locationStateBackground && (
        <Routes>
          <Route
            path='/feed/:id'
            element={
              <Modal
                title=''
                onClose={() => {
                  dispatch(toggleModal());
                }}
              >
                <Feed />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => {
                  dispatch(toggleModal());
                  navigate('/');
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
