import {CommonModule} from "@angular/common";
import {FormsModule, NgForm} from "@angular/forms";
import {Component, ViewChild} from "@angular/core";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {By} from "@angular/platform-browser";
import {EqualValidator} from '../directives/validateEqual';
describe('ValidateEqual', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [TestComponent, EqualValidator],
      providers: [ ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });
  it('should validate successfull', async (done) => {
    component.field1 = '12345678901234';
    component.field2 = '12345678901234';
    fixture.detectChanges();
    await fixture.whenStable();
    let field2Model = fixture.debugElement.query(By.css('input[name=field2]')).references['field2Model'];
    expect(field2Model.valid).toBeTruthy();
    expect(component.ngForm.valid).toBeTruthy();
    done();
  });

  it('should invalidate two fields that do not match', async (done) => {
    component.field1 = '12345678901234';
    component.field2 = '12345678999999';
    fixture.detectChanges();
    await fixture.whenStable()
    let field2Model = fixture.debugElement.query(By.css('input[name=field2]')).references['field2Model'];
    expect(field2Model.valid).toBeFalsy();
    expect(component.ngForm.controls.field2.errors.validateEqual).toBeTruthy();
    expect(component.ngForm.valid).toBeFalsy();
    done();
  });
});
@Component({
  template: '<form #form1="ngForm" novalidate>' +
            '<input name="field1" #field1Model="ngModel" [(ngModel)]="field1">' +
            '<input name="field2" #field2Model="ngModel" validateEqual="field1" [(ngModel)]="field2">' +
            '</form>'
})
class TestComponent {
 @ViewChild(NgForm) ngForm: NgForm;
  field1: string;
  field2: string;
}