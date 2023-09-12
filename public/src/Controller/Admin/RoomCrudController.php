<?php

namespace App\Controller\Admin;

use App\Entity\Room;
use App\Form\JsonCodeEditorType;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\CodeEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class RoomCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Room::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            TextField::new('code'),
            TextField::new('label'),
            NumberField::new('rows'),
            NumberField::new('columns'),
            CodeEditorField::new('blockedSeats')
                ->onlyOnForms()
                ->setFormType(JsonCodeEditorType::class)
                ->setLanguage('js')
                ->setNumOfRows(20)
            ,
        ];
    }
}
