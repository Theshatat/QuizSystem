import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Header } from './Components/header/header';
import { Footer } from './Components/footer/footer';
import { Login } from './Components/login/login';
import { SignUp } from './Components/sign-up/sign-up';
import { NotFound } from './Components/not-found/not-found';
import { Quiz } from './Components/quiz/quiz';
import { QuizDetails } from './Components/quiz-details/quiz-details';
import { authGuardGuard } from './Guards/auth-guard-guard';
import { TakeQuiz } from './Components/take-quiz/take-quiz';
import { Result } from './Components/result/result';
import { CreateQuiz } from './Components/create-quiz/create-quiz';
import { CreateQuestions } from './Components/create-questions/create-questions';
import { instructorGuardGuard } from './Guards/InstructorGuard/instructor-guard-guard';
import { ManageQuiz } from './Components/manage-quiz/manage-quiz';
import { EditQuiz } from './Components/edit-quiz/edit-quiz';
import { EditQuestion } from './Components/edit-question/edit-question';

export const routes: Routes = [
    {path:'', redirectTo: 'home',pathMatch:'full'},
    {path:'home' , component :Home},
    {path:'header', component: Header},
    {path:'footer', component: Footer},
    {path:'login', component:Login },
    {path:'sign-up', component: SignUp},
    {path:'quizzes', component: Quiz, canActivate: [authGuardGuard]},
    {path:'quizzes/:id', component: QuizDetails , canActivate: [authGuardGuard]},
    {path:'takequiz/:id', component: TakeQuiz, canActivate: [authGuardGuard]},
    {path:'create-quiz', component: CreateQuiz, canActivate: [authGuardGuard]},
    {path:'quizzes/:quizId/Questions/Create', component: CreateQuestions, canActivate: [authGuardGuard,instructorGuardGuard]},
    {path:'quizzes/:id/result/:attemptId', component: Result, canActivate: [authGuardGuard,instructorGuardGuard]},
    {path:'quizzes/manage-quiz/:id', component: ManageQuiz, canActivate: [authGuardGuard,instructorGuardGuard]},
    {path:'quizzes/:id/edit', component: EditQuiz, canActivate: [authGuardGuard,instructorGuardGuard]},
    {path:'questions/:id/edit', component: EditQuestion, canActivate: [authGuardGuard,instructorGuardGuard]},
    {path:'**', component: NotFound}
];
