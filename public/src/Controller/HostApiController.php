<?php

namespace App\Controller;

use App\Entity\Event;
use App\Repository\EventRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/v1/host', name: 'app_host_api_')]
class HostApiController extends AbstractController
{
    #[Route('/event-info', name: 'eventinfo_active')]
    public function getEventInfoActive(
        EventRepository $eventRepository,
    ): Response
    {
        $event = $eventRepository->findOneBy(['isActive' => true]);

        if (!$event) {
            return $this->json(['error' => 'No active event found'], Response::HTTP_NOT_FOUND);
        }

        return $this->redirectToRoute('app_host_api_eventinfo', ['id' => $event->getId()]);
    }

    #[Route('/event-info/{id}', name: 'eventinfo', requirements: ['id' => '\d+'])]
    public function getEventInfo(
        EventRepository $eventRepository,
    ): JsonResponse
    {
        $event = $eventRepository->findOneBy(['isActive' => true]);

        $json = [
            'event' => [
                'id' => $event->getId(),
                'code' => $event->getCode(),
                'label' => $event->getLabel(),
                'start' => $event->getStartAt()->format('Y-m-d H:i:s'),
            ],
            'room' => [
                'code' => $event->getRoom()->getCode(),
                'label' => $event->getRoom()->getLabel(),
                'rows' => $event->getRoom()->getRows(),
                'columns' => $event->getRoom()->getColumns(),
                'blocked_seats' => $event->getRoom()->getBlockedSeats(),
            ],
            'attendees' => [
                'local' => [],
                'remote' => [],
            ],
        ];

        foreach ($event->getAttendees() as $attendee) {
            if ($attendee->isIsRemote()) {
                $json['attendees']['remote'][] = [
                    'id' => $attendee->getId(),
                    'firstname' => $attendee->getFirstname(),
                    'lastname' => $attendee->getLastname(),
                    'code' => $attendee->getCode(),
                ];
            } else {
                $json['attendees']['local'][$attendee->getSeatRow()][$attendee->getSeatColumn()][] = [
                    'id' => $attendee->getId(),
                    'firstname' => $attendee->getFirstname(),
                    'lastname' => $attendee->getLastname(),
                    'code' => $attendee->getCode(),
                ];
            }
        }

        return $this->json($json);
    }

    #[Route('/event-info/csv', name: 'eventattendancecsv_active', requirements: ['id' => '\d+'])]
    public function getEventAttendanceCSVActive(
        EventRepository $eventRepository,
    ): Response
    {
        $event = $eventRepository->findOneBy(['isActive' => true]);

        if (!$event) {
            return $this->json(['error' => 'No active event found'], Response::HTTP_NOT_FOUND);
        }

        return $this->redirectToRoute('app_host_api_eventattendancecsv', ['id' => $event->getId()]);
    }

    #[Route('/event-info/{id}/csv', name: 'eventattendancecsv', requirements: ['id' => '\d+'])]
    public function getEventAttendanceCSV(
        Event $event,
    ): Response
    {

        $csv = [];
        $csv[] = ['event', 'start', 'lastname', 'firstname', 'code', 'is_remote', 'seat_row', 'seat_column'];
        foreach ($event->getAttendees() as $attendee) {
            $csv[] = [
                $event->getCode(),
                $event->getStartAt()->format('Y-m-d H:i:s'),
                $attendee->getLastname(),
                $attendee->getFirstname(),
                $attendee->getCode(),
                $attendee->isIsRemote() ? '1' : '0',
                $attendee->getSeatRow(),
                $attendee->getSeatColumn(),
            ];
        }

        $response = new Response(implode("\n", array_map(function ($row) {
            return implode(';', $row);
        }, $csv)));
        $response->headers->add([
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"attendance-{$event->getCode()}-{$event->getStartAt()->format('Ymd-Hi')}.csv\"",
        ]);

        return $response;
    }
}
