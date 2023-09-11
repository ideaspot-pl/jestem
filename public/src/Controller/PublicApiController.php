<?php

namespace App\Controller;

use App\Entity\Attendee;
use App\Entity\Event;
use App\Repository\AttendeeRepository;
use App\Repository\EventRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/v1', name: 'app_public_api_')]
class PublicApiController extends AbstractController
{
    #[Route('/event-info', name: 'eventinfo')]
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
                'taken_seats' => [],
            ],
        ];

        foreach ($event->getAttendees() as $attendee) {
            if ($attendee->isIsRemote() || !$attendee->getSeatRow() || !$attendee->getSeatColumn()) {
                continue;
            }

            $json['room']['taken_seats'][] = [
                $attendee->getSeatRow(),
                $attendee->getSeatColumn(),
            ];
        }

        return $this->json($json);
    }

    #[Route('/event/{id}/attend', name: 'event_attend', methods: ['POST'])]
    function postEventAttend(
        #[MapRequestPayload] Attendee $attendee,
        Event $event,
        AttendeeRepository $attendeeRepository,
        ValidatorInterface $validator,
    ): JsonResponse
    {
        $errors = $validator->validate($attendee, null, ['attend']);
        if (count($errors)) {
            return $this->json([
                'success' => false,
                'errors' => (string) $errors,
            ]);
        }

        $existingAttendee = $attendeeRepository->findOneBy([
            'event' => $event,
            'token' => $attendee->getToken(),
        ]);

        if ($existingAttendee) {
            $existingAttendee
                ->setFirstname($attendee->getFirstname())
                ->setLastname($attendee->getLastname())
                ->setCode($attendee->getCode())
                ->setIsRemote($attendee->isIsRemote())
                ->setSeatRow($attendee->getSeatRow())
                ->setSeatColumn($attendee->getSeatColumn())
            ;
            $attendeeRepository->save($existingAttendee, true);
        } else {
            $event->addAttendee($attendee);
            $attendeeRepository->save($attendee, true);
        }

        return $this->json([
            'success' => true,
        ]);
    }
}
