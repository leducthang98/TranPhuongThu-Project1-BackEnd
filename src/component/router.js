import AuthRouter from './auth/AuthRouter';
import DefaultRouter from './default/DefaultRouter';
import ItemRouter from './item/ItemRouter';
import NewsRouter from './news/NewsRouter';
import UserRouter from './user/UserRouter';

export default [
    DefaultRouter,
    AuthRouter,
    ItemRouter,
    UserRouter,
    NewsRouter
]