<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AttendanceController extends AbstractController
{
    #[Route('/', name: 'app_attendance_markattenddance')]
    public function markAttendance(): Response
    {
        return $this->render("attendance/mark_attendance.html.twig");
    }
}
