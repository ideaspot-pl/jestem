<?php

namespace App\Controller;

use App\Entity\Event;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AttendanceController extends AbstractController
{
    #[Route('/', name: 'app_attendance_markattenddance')]
    #[Route('/{code}', name: 'app_attendance_markattenddance_code')]
    public function markAttendance(
        ?Event $event = null,
    ): Response
    {
        return $this->render("attendance/mark_attendance.html.twig", [
            'event' => $event,
        ]);
    }
}
